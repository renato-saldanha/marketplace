# ⚡ Comandos Rápidos - Marketplace

## 🚀 Início Rápido

### Com Docker
```bash
docker-compose up --build -d
docker-compose logs -f
```

### Sem Docker
```bash
# Terminal 1: Backend
cd backend && python run.py

# Terminal 2: Frontend
npm run dev
```

---

## 🐳 Docker

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Rebuild
docker-compose build --no-cache

# Logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Status
docker-compose ps

# Reiniciar
docker-compose restart backend

# Limpar tudo
docker-compose down -v --rmi all
```

---

## 💻 Frontend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Testes
npm test
npm run test:watch
npm run test:coverage

# Linting
npm run lint

# Instalar dependência
npm install <pacote>

# Limpar node_modules
rm -rf node_modules package-lock.json
npm install
```

---

## 🐍 Backend

```bash
# Iniciar servidor
python run.py
# OU
uvicorn app.main:app --reload

# Testes
pytest
pytest -v
pytest --cov

# Banco de dados
python init_db.py
python criar_dados_teste.py

# Migrações
alembic upgrade head
alembic revision --autogenerate -m "descrição"
alembic downgrade -1

# Ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Dependências
pip install -r requirements.txt
pip freeze > requirements.txt

# Limpar cache Python
find . -type d -name "__pycache__" -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

---

## 🗄️ PostgreSQL

```bash
# Acessar PostgreSQL
psql -U postgres

# Com Docker
docker-compose exec postgres psql -U marketplace_user -d marketplace_db

# Criar banco
CREATE DATABASE marketplace_db;
CREATE USER marketplace_user WITH PASSWORD 'marketplace_pass';
GRANT ALL PRIVILEGES ON DATABASE marketplace_db TO marketplace_user;

# Backup
pg_dump -U marketplace_user marketplace_db > backup.sql
# Com Docker
docker-compose exec postgres pg_dump -U marketplace_user marketplace_db > backup.sql

# Restaurar
psql -U marketplace_user marketplace_db < backup.sql
# Com Docker
cat backup.sql | docker-compose exec -T postgres psql -U marketplace_user marketplace_db

# Ver tabelas
\dt

# Descrever tabela
\d nome_tabela

# Sair
\q
```

---

## 🔍 Troubleshooting

```bash
# Ver porta em uso (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5432

# Ver porta em uso (Linux/Mac)
lsof -i :3000
lsof -i :8000
lsof -i :5432

# Matar processo (Windows)
taskkill /PID <PID> /F

# Matar processo (Linux/Mac)
kill -9 <PID>

# Verificar Docker
docker --version
docker-compose --version
docker ps
docker stats

# Limpar Docker
docker system prune -a
docker volume prune
```

---

## 📁 Navegação

```bash
# Estrutura básica
marketplace/
├── backend/     # cd backend
├── src/         # Código frontend
├── public/      # Arquivos estáticos
└── docker-compose.yml

# Arquivos importantes
backend/app/main.py           # Entrada backend
backend/app/api/              # Rotas API
backend/requirements.txt      # Deps Python

src/app/page.tsx             # Página principal
src/components/              # Componentes
src/lib/api.ts               # Cliente API

docker-compose.yml           # Config Docker
.env                         # Variáveis ambiente
```

---

## 🌐 URLs

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| PostgreSQL | localhost:5432 |

---

## 👤 Credenciais de Teste

```
Email: vendedor@teste.com
Senha: senha123
```

---

## 🔄 Workflow Diário

```bash
# Manhã - Iniciar
docker-compose up -d
# OU
cd backend && python run.py &
npm run dev

# Durante o dia - Ver logs
docker-compose logs -f

# Fim do dia - Parar
docker-compose down
```

---

## 🚨 Comandos de Emergência

```bash
# Reset completo Docker
docker-compose down -v --rmi all
docker system prune -a --volumes -f
docker-compose up --build -d

# Reset backend
cd backend
rm -rf __pycache__ **/__pycache__
rm test.db
python init_db.py
python criar_dados_teste.py

# Reset frontend
rm -rf .next node_modules
npm install
npm run dev

# Reset PostgreSQL (dados perdidos!)
docker-compose down -v
docker-compose up -d
docker-compose exec backend python init_db.py
docker-compose exec backend python criar_dados_teste.py
```

---

## 📊 Testes

```bash
# Frontend
npm test                    # Todos
npm test Button            # Específico
npm run test:coverage      # Cobertura

# Backend
pytest                     # Todos
pytest tests/test_auth.py  # Específico
pytest -v                  # Verbose
pytest --cov               # Cobertura
pytest -k "test_login"     # Por nome

# Com Docker
docker-compose exec frontend npm test
docker-compose exec backend pytest
```

---

## 🔐 Git

```bash
# Status
git status

# Adicionar arquivos
git add .
git add arquivo.py

# Commit
git commit -m "mensagem"

# Push
git push origin main

# Pull
git pull origin main

# Criar branch
git checkout -b feature/nova-feature

# Ver branches
git branch

# Trocar branch
git checkout main

# Merge
git merge feature/nova-feature

# Desfazer mudanças
git restore arquivo.py
git restore --staged arquivo.py
```

---

## 💡 Dicas

```bash
# Alias úteis (adicione ao seu .bashrc ou PowerShell $PROFILE)
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose restart'

# Executar múltiplos comandos
cd backend && python run.py && cd ..

# Background (Linux/Mac)
python run.py &

# Ver processos
ps aux | grep python
ps aux | grep node

# Variáveis de ambiente
export NEXT_PUBLIC_API_URL=http://localhost:8000  # Linux/Mac
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"  # PowerShell

# Ver variáveis
echo $NEXT_PUBLIC_API_URL    # Linux/Mac
$env:NEXT_PUBLIC_API_URL     # PowerShell
```

---

## 📚 Documentação Completa

- `README.md` - Documentação principal
- `DOCKER_README.md` - Guia completo Docker
- `COMANDOS_DOCKER.md` - Referência Docker
- `INSTALACAO_DOCKER.md` - Instalar Docker
- `SETUP_COMPLETO_DOCKER.md` - Resumo configuração

---

**Atalho para este arquivo:**
```bash
# Linux/Mac
cat COMANDOS_RAPIDOS.md | less

# Windows
notepad COMANDOS_RAPIDOS.md
```

