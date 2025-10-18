# ⚡ Otimizações para Produção

Guia completo de otimizações de performance para o Marketplace em ambiente de produção.

## 📋 Índice

1. [PostgreSQL](#postgresql)
2. [Redis](#redis)
3. [Nginx](#nginx)
4. [Backend FastAPI](#backend-fastapi)
5. [Frontend Next.js](#frontend-nextjs)
6. [Docker](#docker)
7. [Sistema Operacional](#sistema-operacional)
8. [Monitoramento de Performance](#monitoramento-de-performance)

---

## 🗄️ PostgreSQL

### Configurações Básicas

```bash
# Conectar ao PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres psql -U marketplace_user -d marketplace_db
```

```sql
-- Ver configurações atuais
SHOW ALL;

-- Configurações recomendadas para 4GB RAM
ALTER SYSTEM SET shared_buffers = '1GB';
ALTER SYSTEM SET effective_cache_size = '3GB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '6553kB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';
ALTER SYSTEM SET max_worker_processes = 4;
ALTER SYSTEM SET max_parallel_workers_per_gather = 2;
ALTER SYSTEM SET max_parallel_workers = 4;
ALTER SYSTEM SET max_parallel_maintenance_workers = 2;

-- Aplicar mudanças
SELECT pg_reload_conf();
```

### Índices Importantes

```sql
-- Índices para tabela de produtos
CREATE INDEX CONCURRENTLY idx_produtos_vendedor_id ON produtos(vendedor_id);
CREATE INDEX CONCURRENTLY idx_produtos_categoria ON produtos(categoria);
CREATE INDEX CONCURRENTLY idx_produtos_preco ON produtos(preco);
CREATE INDEX CONCURRENTLY idx_produtos_ativo ON produtos(ativo);
CREATE INDEX CONCURRENTLY idx_produtos_criado_em ON produtos(criado_em DESC);

-- Índice composto para buscas comuns
CREATE INDEX CONCURRENTLY idx_produtos_ativo_categoria ON produtos(ativo, categoria) WHERE ativo = true;

-- Índice para busca textual
CREATE INDEX CONCURRENTLY idx_produtos_nome_trgm ON produtos USING gin(nome gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_produtos_descricao_trgm ON produtos USING gin(descricao gin_trgm_ops);

-- Índices para usuários
CREATE INDEX CONCURRENTLY idx_usuarios_email ON usuarios(email);
CREATE INDEX CONCURRENTLY idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX CONCURRENTLY idx_usuarios_ativo ON usuarios(ativo);

-- Verificar uso dos índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Encontrar índices não utilizados
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE 'pg_toast%';
```

### Vacuum e Manutenção

```sql
-- Habilitar autovacuum agressivo
ALTER SYSTEM SET autovacuum = on;
ALTER SYSTEM SET autovacuum_max_workers = 3;
ALTER SYSTEM SET autovacuum_naptime = '30s';

-- Vacuum manual (em horário de baixo tráfego)
VACUUM ANALYZE;

-- Vacuum completo (requer lock)
VACUUM FULL ANALYZE produtos;

-- Ver estatísticas de vacuum
SELECT schemaname, tablename, last_vacuum, last_autovacuum, last_analyze, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY last_autovacuum DESC;
```

### Connection Pooling

Adicionar PgBouncer ao `docker-compose.prod.yml`:

```yaml
pgbouncer:
  image: pgbouncer/pgbouncer:latest
  container_name: marketplace_pgbouncer
  restart: unless-stopped
  environment:
    - DATABASES_HOST=postgres
    - DATABASES_PORT=5432
    - DATABASES_USER=marketplace_user
    - DATABASES_PASSWORD=${POSTGRES_PASSWORD}
    - DATABASES_DBNAME=marketplace_db
    - POOL_MODE=transaction
    - MAX_CLIENT_CONN=100
    - DEFAULT_POOL_SIZE=20
  ports:
    - "127.0.0.1:6432:6432"
  networks:
    - marketplace_network_prod
  depends_on:
    - postgres
```

---

## 🔄 Redis

### Configurações Otimizadas

O Redis já está configurado no `docker-compose.prod.yml`:

```yaml
redis:
  command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
```

### Uso no Backend

Adicionar ao `backend/requirements.txt`:
```
redis==5.0.1
```

Criar arquivo `backend/app/core/cache.py`:

```python
import redis
from functools import wraps
import json
import os

# Configuração Redis
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'redis'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    password=os.getenv('REDIS_PASSWORD'),
    decode_responses=True
)

def cache_result(expire_time=300):
    """Decorator para cachear resultados de funções"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Criar chave única
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Tentar obter do cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Executar função e cachear resultado
            result = await func(*args, **kwargs)
            redis_client.setex(
                cache_key,
                expire_time,
                json.dumps(result, default=str)
            )
            return result
        return wrapper
    return decorator
```

Usar no código:

```python
from app.core.cache import cache_result

@router.get("/produtos/destaques")
@cache_result(expire_time=600)  # Cache por 10 minutos
async def listar_produtos_destaques(db: Session = Depends(get_db)):
    return db.query(Produto).filter(Produto.destaque == True).all()
```

---

## 🌐 Nginx

### Configurações Adicionais

Já otimizado em `nginx/nginx.conf`, mas pode ajustar:

```nginx
# Aumentar workers se tiver mais CPUs
worker_processes 8;  # Número de CPUs

# Buffer sizes
client_body_buffer_size 128k;
client_max_body_size 10m;
client_header_buffer_size 1k;
large_client_header_buffers 4 16k;
output_buffers 1 32k;
postpone_output 1460;

# Timeouts
client_header_timeout 3m;
client_body_timeout 3m;
send_timeout 3m;

# Static file caching
open_file_cache max=1000 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 2;
open_file_cache_errors on;
```

### Cache de Proxy Avançado

```nginx
# Em nginx/conf.d/marketplace.conf
proxy_cache_path /var/cache/nginx/api 
    levels=1:2 
    keys_zone=api_cache:10m 
    max_size=100m 
    inactive=60m 
    use_temp_path=off;

# Para endpoints específicos
location /api/produtos/destaques {
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_cache_lock on;
    
    add_header X-Cache-Status $upstream_cache_status;
    
    proxy_pass http://backend;
}
```

---

## 🔥 Backend FastAPI

### Gunicorn com Workers Otimizado

Ajustar em `backend/Dockerfile.prod`:

```dockerfile
# Calcular workers: (2 x CPU cores) + 1
CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "120", \
     "--keepalive", "5", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "50", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "--log-level", "info"]
```

### Paginação Eficiente

```python
from fastapi import Query

@router.get("/produtos")
async def listar_produtos(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    produtos = db.query(Produto)\
        .filter(Produto.ativo == True)\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    total = db.query(Produto).filter(Produto.ativo == True).count()
    
    return {
        "items": produtos,
        "total": total,
        "skip": skip,
        "limit": limit
    }
```

### Queries Otimizadas

```python
from sqlalchemy.orm import joinedload

# Evitar N+1 queries
@router.get("/produtos/{id}")
async def obter_produto(id: int, db: Session = Depends(get_db)):
    produto = db.query(Produto)\
        .options(joinedload(Produto.vendedor))\
        .filter(Produto.id == id)\
        .first()
    return produto

# Eager loading
produtos = db.query(Produto)\
    .options(
        joinedload(Produto.vendedor),
        joinedload(Produto.imagens)
    )\
    .all()
```

### Background Tasks

```python
from fastapi import BackgroundTasks

def enviar_email_background(email: str, mensagem: str):
    # Enviar email de forma assíncrona
    pass

@router.post("/usuarios/registrar")
async def registrar_usuario(
    usuario: UsuarioCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    novo_usuario = criar_usuario(db, usuario)
    
    # Adicionar tarefa em background
    background_tasks.add_task(
        enviar_email_background,
        novo_usuario.email,
        "Bem-vindo!"
    )
    
    return novo_usuario
```

---

## ⚛️ Frontend Next.js

### Otimizações de Imagem

```tsx
import Image from 'next/image';

<Image
  src="/produto.jpg"
  alt="Produto"
  width={300}
  height={300}
  quality={75}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Memoização

```tsx
import { memo, useMemo, useCallback } from 'react';

// Componente memoizado
const ProdutoCard = memo(({ produto }) => {
  return <div>{produto.nome}</div>;
});

// Hook useMemo
const produtosFiltrados = useMemo(() => {
  return produtos.filter(p => p.categoria === categoria);
}, [produtos, categoria]);

// Hook useCallback
const handleClick = useCallback(() => {
  console.log('Clicado');
}, []);
```

### Code Splitting

```tsx
import dynamic from 'next/dynamic';

// Carregamento dinâmico
const GraficoVendas = dynamic(() => import('@/components/GraficoVendas'), {
  loading: () => <p>Carregando...</p>,
  ssr: false
});

// Lazy loading com React.lazy
const Modal = lazy(() => import('./Modal'));
```

### API Routes Otimizadas

```typescript
// app/api/produtos/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 60; // Revalidar a cada 60s

export async function GET() {
  const produtos = await fetch('http://backend:8000/produtos', {
    next: { revalidate: 60 }
  });
  
  return NextResponse.json(produtos);
}
```

---

## 🐳 Docker

### Multi-stage Builds

Já implementado nos Dockerfiles de produção.

### Build Cache

```bash
# Usar BuildKit
export DOCKER_BUILDKIT=1

# Build com cache
docker compose -f docker-compose.prod.yml build --build-arg BUILDKIT_INLINE_CACHE=1
```

### Limitar Recursos

Já configurado em `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 256M
```

### Docker Daemon

Copiar `docker-daemon-example.json` para `/etc/docker/daemon.json`:

```bash
sudo cp docker-daemon-example.json /etc/docker/daemon.json
sudo systemctl restart docker
```

---

## 🖥️ Sistema Operacional

### Kernel Parameters

```bash
# Editar
sudo nano /etc/sysctl.conf
```

Adicionar:

```conf
# Rede
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15

# Memória
vm.swappiness = 10
vm.overcommit_memory = 1

# File descriptors
fs.file-max = 2097152
```

Aplicar:
```bash
sudo sysctl -p
```

### Limits

```bash
# Editar
sudo nano /etc/security/limits.conf
```

Adicionar:

```conf
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536
```

### Swap

```bash
# Criar swap de 4GB se não existir
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Tornar permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📊 Monitoramento de Performance

### Prometheus + Grafana

Criar `docker-compose.monitoring.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: marketplace_prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - marketplace_network_prod

  grafana:
    image: grafana/grafana:latest
    container_name: marketplace_grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3001:3000"
    networks:
      - marketplace_network_prod

volumes:
  prometheus_data:
  grafana_data:

networks:
  marketplace_network_prod:
    external: true
```

### Métricas do Backend

Adicionar ao `backend/requirements.txt`:
```
prometheus-fastapi-instrumentator==6.1.0
```

Em `backend/app/main.py`:

```python
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

# Adicionar métricas
Instrumentator().instrument(app).expose(app)
```

### Query Performance

```sql
-- Habilitar log de queries lentas
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- 1 segundo
ALTER SYSTEM SET log_statement = 'all';

-- Ver queries lentas
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 📈 Benchmarks

### Teste de Carga

```bash
# Instalar Apache Bench
sudo apt install apache2-utils

# Teste simples
ab -n 1000 -c 10 http://localhost/

# Teste com autenticação
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" http://localhost/api/produtos
```

### Wrk (Mais avançado)

```bash
# Instalar wrk
sudo apt install wrk

# Teste
wrk -t4 -c100 -d30s http://localhost/

# Com script Lua
wrk -t4 -c100 -d30s -s script.lua http://localhost/
```

---

## ✅ Checklist de Otimização

- [ ] PostgreSQL configurado e otimizado
- [ ] Índices criados para queries frequentes
- [ ] Redis configurado para cache
- [ ] Nginx otimizado com cache
- [ ] Gunicorn com workers adequados
- [ ] Connection pooling configurado
- [ ] Imagens otimizadas no frontend
- [ ] Code splitting implementado
- [ ] Docker com limites de recursos
- [ ] Kernel parameters ajustados
- [ ] Monitoramento configurado
- [ ] Benchmarks executados
- [ ] Vacuum automático configurado
- [ ] Logs sendo analisados

---

## 📚 Recursos

- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance-tips.html)
- [FastAPI Performance](https://fastapi.tiangolo.com/deployment/concepts/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Nginx Tuning](https://www.nginx.com/blog/tuning-nginx/)

---

**⚡ Sistema otimizado para alta performance!**

Monitore regularmente e ajuste conforme necessário para seu caso de uso específico.

