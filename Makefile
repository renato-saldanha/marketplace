# Makefile para facilitar comandos Docker
.PHONY: help build up down logs restart clean

# Configuração
COMPOSE_DEV = docker-compose.yml
COMPOSE_PROD = docker-compose.prod.yml

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ========================================
# DESENVOLVIMENTO
# ========================================

dev-build: ## Build dos containers de desenvolvimento
	docker-compose -f $(COMPOSE_DEV) build

dev-up: ## Inicia containers de desenvolvimento
	docker-compose -f $(COMPOSE_DEV) up -d

dev-down: ## Para containers de desenvolvimento
	docker-compose -f $(COMPOSE_DEV) down

dev-logs: ## Mostra logs de desenvolvimento
	docker-compose -f $(COMPOSE_DEV) logs -f

dev-restart: ## Reinicia containers de desenvolvimento
	docker-compose -f $(COMPOSE_DEV) restart

dev-clean: ## Remove containers, volumes e imagens de desenvolvimento
	docker-compose -f $(COMPOSE_DEV) down -v --rmi all

# ========================================
# PRODUÇÃO
# ========================================

prod-build: ## Build dos containers de produção
	docker-compose -f $(COMPOSE_PROD) build --no-cache

prod-up: ## Inicia containers de produção
	docker-compose -f $(COMPOSE_PROD) up -d

prod-down: ## Para containers de produção
	docker-compose -f $(COMPOSE_PROD) down

prod-logs: ## Mostra logs de produção
	docker-compose -f $(COMPOSE_PROD) logs -f

prod-restart: ## Reinicia containers de produção
	docker-compose -f $(COMPOSE_PROD) restart

prod-clean: ## Remove containers e volumes de produção (CUIDADO!)
	docker-compose -f $(COMPOSE_PROD) down -v

# ========================================
# BANCO DE DADOS
# ========================================

db-migrate: ## Executa migrações do banco (desenvolvimento)
	docker-compose -f $(COMPOSE_DEV) exec backend alembic upgrade head

db-migrate-prod: ## Executa migrações do banco (produção)
	docker-compose -f $(COMPOSE_PROD) exec backend alembic upgrade head

db-backup: ## Faz backup do banco de dados
	./scripts/backup-database.sh

db-restore: ## Restaura backup do banco de dados
	./scripts/restore-database.sh

db-shell: ## Acessa shell do PostgreSQL
	docker-compose -f $(COMPOSE_DEV) exec postgres psql -U marketplace_user -d marketplace_db

# ========================================
# TESTES
# ========================================

test-backend: ## Executa testes do backend
	docker-compose -f $(COMPOSE_DEV) exec backend pytest -v

test-backend-cov: ## Executa testes do backend com coverage
	docker-compose -f $(COMPOSE_DEV) exec backend pytest --cov --cov-report=html

test-frontend: ## Executa testes do frontend
	docker-compose -f $(COMPOSE_DEV) exec frontend npm test

# ========================================
# MONITORAMENTO
# ========================================

ps: ## Lista containers em execução
	docker-compose -f $(COMPOSE_DEV) ps

stats: ## Mostra estatísticas de uso dos containers
	docker stats

monitor: ## Executa script de monitoramento
	./scripts/monitor.sh

# ========================================
# LIMPEZA
# ========================================

clean-logs: ## Limpa logs do Docker
	sudo sh -c "truncate -s 0 /var/lib/docker/containers/*/*-json.log" 2>/dev/null || echo "Sem permissão ou logs não encontrados"

clean-system: ## Limpa sistema Docker (interativo)
	./scripts/clean-system.sh

prune: ## Remove containers parados, imagens não usadas e volumes
	docker system prune -a --volumes -f

# ========================================
# UTILIDADES
# ========================================

shell-backend: ## Acessa shell do container backend
	docker-compose -f $(COMPOSE_DEV) exec backend sh

shell-frontend: ## Acessa shell do container frontend
	docker-compose -f $(COMPOSE_DEV) exec frontend sh

install-backend: ## Instala nova dependência no backend
	@read -p "Nome do pacote: " package; \
	docker-compose -f $(COMPOSE_DEV) exec backend pip install $$package && \
	docker-compose -f $(COMPOSE_DEV) exec backend pip freeze > backend/requirements.txt

install-frontend: ## Instala nova dependência no frontend
	@read -p "Nome do pacote: " package; \
	docker-compose -f $(COMPOSE_DEV) exec frontend npm install $$package

# ========================================
# DEPLOY
# ========================================

deploy: ## Executa deploy de produção
	./scripts/deploy-prod.sh

ssl-setup: ## Configura SSL/HTTPS
	./scripts/setup-ssl.sh

# ========================================
# ATALHOS
# ========================================

up: dev-up ## Alias para dev-up

down: dev-down ## Alias para dev-down

logs: dev-logs ## Alias para dev-logs

restart: dev-restart ## Alias para dev-restart

build: dev-build ## Alias para dev-build

