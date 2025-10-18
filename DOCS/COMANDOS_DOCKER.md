# 🐳 Comandos Rápidos - Docker Marketplace

## 🚀 Comandos Essenciais

### Iniciar pela primeira vez (com build)
```powershell
docker-compose up --build -d
```

### Iniciar (após primeira vez)
```powershell
docker-compose up -d
```

### Parar containers
```powershell
docker-compose down
```

### Ver logs em tempo real
```powershell
# Todos os containers
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

### Reiniciar um serviço
```powershell
docker-compose restart backend
docker-compose restart frontend
```

### Ver status dos containers
```powershell
docker-compose ps
```

---

## 🔧 Comandos de Manutenção

### Rebuild completo (limpar cache)
```powershell
docker-compose build --no-cache
docker-compose up -d
```

### Limpar tudo e recomeçar
```powershell
docker-compose down -v --rmi all
docker-compose up --build -d
```

### Acessar shell de um container
```powershell
# Backend
docker-compose exec backend sh

# Frontend  
docker-compose exec frontend sh

# PostgreSQL
docker-compose exec postgres psql -U marketplace_user -d marketplace_db
```

---

## 🗄️ Comandos do Banco de Dados

### Criar backup
```powershell
docker-compose exec postgres pg_dump -U marketplace_user marketplace_db > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

### Restaurar backup
```powershell
Get-Content backup.sql | docker-compose exec -T postgres psql -U marketplace_user marketplace_db
```

### Acessar PostgreSQL
```powershell
docker-compose exec postgres psql -U marketplace_user -d marketplace_db
```

### Reinicializar banco
```powershell
docker-compose exec backend python init_db.py
docker-compose exec backend python criar_dados_teste.py
```

---

## 🧪 Comandos de Desenvolvimento

### Rodar testes do backend
```powershell
docker-compose exec backend pytest
docker-compose exec backend pytest -v
docker-compose exec backend pytest --cov
```

### Rodar testes do frontend
```powershell
docker-compose exec frontend npm test
docker-compose exec frontend npm run test:coverage
```

### Instalar nova dependência

#### Backend
```powershell
docker-compose exec backend pip install nome-pacote
docker-compose exec backend pip freeze > requirements.txt
```

#### Frontend
```powershell
docker-compose exec frontend npm install nome-pacote
```

---

## 📊 Monitoramento

### Ver uso de recursos
```powershell
docker stats
```

### Ver espaço usado
```powershell
docker system df
```

### Inspecionar container
```powershell
docker inspect marketplace_backend
docker inspect marketplace_frontend
docker inspect marketplace_postgres
```

---

## 🆘 Troubleshooting

### Container não inicia
```powershell
# Ver logs detalhados
docker-compose logs backend

# Rebuild do zero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Porta já em uso
```powershell
# Ver processos usando a porta
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Matar processo (substitua PID)
Stop-Process -Id PID -Force
```

### Erro de permissão
```powershell
# Executar PowerShell como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Limpar sistema Docker
```powershell
# Remove containers parados
docker container prune -f

# Remove imagens não usadas
docker image prune -a -f

# Remove volumes não usados
docker volume prune -f

# Limpar tudo
docker system prune -a --volumes -f
```

---

## 🌐 URLs de Acesso

Após iniciar os containers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Credenciais de teste
```
Email: vendedor@teste.com
Senha: senha123
```

---

## 📝 Scripts Prontos

### Script Windows (docker-start.ps1)
```powershell
.\docker-start.ps1
```

### Comandos em sequência
```powershell
# Setup completo
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
Start-Sleep -Seconds 10
docker-compose logs -f
```

---

## 💡 Dicas

1. ✅ Use `-d` para rodar em background
2. ✅ Use `-f` nos logs para acompanhar em tempo real  
3. ✅ Hot reload funciona dentro dos containers
4. ✅ Mudanças no código são refletidas automaticamente
5. ✅ Volumes persistem os dados entre restarts
6. ⚠️ Use `docker-compose down -v` para apagar os dados
7. ⚠️ Em produção, mude as senhas e chaves secretas!

---

## 🔄 Workflow Recomendado

### Desenvolvimento diário
```powershell
# Manhã - Iniciar
docker-compose up -d
docker-compose logs -f

# Durante o dia - Ver logs quando necessário
docker-compose logs -f backend

# Final do dia - Parar
docker-compose down
```

### Após mudanças no Dockerfile
```powershell
docker-compose down
docker-compose build
docker-compose up -d
```

### Após mudanças no docker-compose.yml
```powershell
docker-compose down
docker-compose up -d
```

---

## ⚡ Atalhos Úteis

```powershell
# Alias para comandos frequentes (adicione ao seu $PROFILE)
function dc { docker-compose $args }
function dcu { docker-compose up -d }
function dcd { docker-compose down }
function dcl { docker-compose logs -f $args }
function dcr { docker-compose restart $args }

# Uso:
# dc up -d
# dcl backend
# dcr frontend
```


## COMANDOS UTEIS
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar tudo
docker-compose down

# Reiniciar
docker-compose restart

# Rebuild
docker-compose up -d --build