# 🐳 Guia Docker - Marketplace

Este guia explica como usar Docker para executar o projeto Marketplace.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)

### Verificar instalação

```bash
docker --version
docker-compose --version
```

## 🚀 Início Rápido

### Windows (PowerShell)

```powershell
# Dar permissão de execução (executar como Administrador)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Executar o script
.\docker-start.ps1
```

### Linux/Mac (Bash)

```bash
# Dar permissão de execução
chmod +x docker-start.sh

# Executar o script
./docker-start.sh
```

## 📦 Estrutura dos Containers

O projeto usa 3 containers:

1. **PostgreSQL** (`marketplace_postgres`) - Porta 5432
   - Banco de dados relacional
   - Volume persistente para dados

2. **Backend** (`marketplace_backend`) - Porta 8000
   - API FastAPI
   - Hot reload habilitado
   - Inicializa banco e cria dados de teste

3. **Frontend** (`marketplace_frontend`) - Porta 3000
   - Next.js
   - Hot reload habilitado
   - Conecta automaticamente ao backend

## 🎯 Comandos Principais

### Primeira execução (com build)

```bash
docker-compose up --build -d
```

### Iniciar containers

```bash
docker-compose up -d
```

### Parar containers

```bash
docker-compose down
```

### Ver logs

```bash
# Todos os containers
docker-compose logs -f

# Container específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Verificar status

```bash
docker-compose ps
```

### Reiniciar um serviço

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Acessar shell de um container

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# PostgreSQL
docker-compose exec postgres psql -U marketplace_user -d marketplace_db
```

## 🔧 Comandos Avançados

### Rebuild sem cache

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Limpar tudo (containers, volumes, imagens)

```bash
docker-compose down -v --rmi all
```

### Ver uso de recursos

```bash
docker stats
```

### Executar comandos no backend

```bash
# Criar migração do banco
docker-compose exec backend alembic revision --autogenerate -m "descrição"

# Aplicar migrações
docker-compose exec backend alembic upgrade head

# Inicializar banco
docker-compose exec backend python init_db.py

# Criar dados de teste
docker-compose exec backend python criar_dados_teste.py

# Rodar testes
docker-compose exec backend pytest
```

### Executar comandos no frontend

```bash
# Instalar nova dependência
docker-compose exec frontend npm install nome-pacote

# Rodar testes
docker-compose exec frontend npm test

# Build de produção
docker-compose exec frontend npm run build
```

## 🌐 URLs de Acesso

Após iniciar os containers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
- **PostgreSQL**: localhost:5432

### Credenciais padrão de teste

```
Email: vendedor@teste.com
Senha: senha123
```

## 📁 Volumes

Os volumes Docker garantem persistência dos dados:

- `postgres_data`: Dados do PostgreSQL
- `backend_uploads`: Arquivos enviados (produtos, perfis)

### Backup do banco de dados

```bash
# Fazer backup
docker-compose exec postgres pg_dump -U marketplace_user marketplace_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U marketplace_user marketplace_db < backup.sql
```

## 🔍 Troubleshooting

### Porta já em uso

```bash
# Ver o que está usando a porta
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Mudar a porta no docker-compose.yml
ports:
  - "3001:3000"  # Muda para 3001
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend

# Reconstruir do zero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Erro de conexão com banco

```bash
# Verificar se PostgreSQL está healthy
docker-compose ps

# Reiniciar o backend
docker-compose restart backend
```

### Frontend não conecta ao backend

Verifique as variáveis de ambiente no `docker-compose.yml`:

```yaml
frontend:
  environment:
    - NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Limpar dados antigos

```bash
# Remove volumes (apaga todos os dados)
docker-compose down -v

# Reinicia do zero
docker-compose up --build -d
```

## 🔒 Segurança em Produção

Antes de usar em produção:

1. **Mudar credenciais do banco** no `.env.docker`
2. **Gerar SECRET_KEY segura**:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
3. **Desabilitar debug**: `DEBUG=false`
4. **Configurar CORS** para domínios específicos
5. **Usar HTTPS** com certificados SSL
6. **Implementar rate limiting**
7. **Configurar backup automático**

## 📊 Monitoramento

### Ver uso de recursos

```bash
docker stats
```

### Healthcheck dos serviços

```bash
# PostgreSQL
docker-compose exec postgres pg_isready -U marketplace_user

# Backend
curl http://localhost:8000/docs

# Frontend
curl http://localhost:3000
```

## 🆘 Comandos de Emergência

```bash
# Parar tudo imediatamente
docker-compose kill

# Remover containers órfãos
docker-compose down --remove-orphans

# Limpar sistema Docker completo (use com cuidado!)
docker system prune -a --volumes
```

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Docker](https://fastapi.tiangolo.com/deployment/docker/)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)

## 💡 Dicas

1. Use `docker-compose up -d` para rodar em background
2. Use `docker-compose logs -f` para acompanhar logs em tempo real
3. Hot reload funciona mesmo dentro dos containers
4. Mudanças no código são refletidas automaticamente
5. Para produção, use o `Dockerfile` (não o `Dockerfile.dev`)

## 🤝 Contribuindo

Se encontrar problemas com Docker:

1. Verifique os logs: `docker-compose logs`
2. Verifique o status: `docker-compose ps`
3. Tente rebuild: `docker-compose build --no-cache`
4. Verifique recursos: `docker stats`

