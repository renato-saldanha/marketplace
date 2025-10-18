#!/bin/bash

# ========================================
# Script de Deploy para Produção
# ========================================

set -e  # Sai se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Deploy Marketplace - Produção${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Verificar se está na branch correta
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
    echo -e "${YELLOW}⚠️  Aviso: Você não está na branch main/master${NC}"
    read -p "Deseja continuar? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Verificar se há mudanças não commitadas
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Há mudanças não commitadas${NC}"
    git status -s
    read -p "Deseja continuar? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Verificar se .env.production existe
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Erro: Arquivo .env.production não encontrado!${NC}"
    echo -e "${YELLOW}   Copie .env.production.example para .env.production e configure${NC}"
    exit 1
fi

# Fazer backup do banco de dados antes do deploy
echo -e "${GREEN}📦 Fazendo backup do banco de dados...${NC}"
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump \
    -U marketplace_user marketplace_db > "backup_pre_deploy_$(date +%Y%m%d_%H%M%S).sql" 2>/dev/null || true

# Parar containers antigos
echo -e "${GREEN}🛑 Parando containers antigos...${NC}"
docker-compose -f docker-compose.prod.yml down

# Fazer pull das últimas mudanças
echo -e "${GREEN}📥 Atualizando código...${NC}"
git pull origin $BRANCH

# Construir novas imagens
echo -e "${GREEN}🏗️  Construindo novas imagens...${NC}"
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VERSION=$(git describe --tags --always)
export BUILD_DATE VERSION

docker-compose -f docker-compose.prod.yml build --no-cache --build-arg BUILD_DATE=$BUILD_DATE --build-arg VERSION=$VERSION

# Iniciar containers
echo -e "${GREEN}🚀 Iniciando containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Aguardar containers iniciarem
echo -e "${GREEN}⏳ Aguardando containers iniciarem...${NC}"
sleep 15

# Verificar saúde dos containers
echo -e "${GREEN}🏥 Verificando saúde dos containers...${NC}"
docker-compose -f docker-compose.prod.yml ps

# Executar migrações do banco
echo -e "${GREEN}🔄 Executando migrações do banco...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend alembic upgrade head || true

# Verificar logs
echo -e "${GREEN}📋 Verificando logs...${NC}"
docker-compose -f docker-compose.prod.yml logs --tail=50

# Teste de conectividade
echo ""
echo -e "${GREEN}🧪 Testando conectividade...${NC}"
sleep 5

if curl -f http://localhost/docs > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend está respondendo!${NC}"
else
    echo -e "${RED}❌ Backend não está respondendo!${NC}"
fi

if curl -f http://localhost/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend está respondendo!${NC}"
else
    echo -e "${RED}❌ Frontend não está respondendo!${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Deploy Concluído!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📊 Comandos úteis:${NC}"
echo -e "  Ver logs:      docker-compose -f docker-compose.prod.yml logs -f"
echo -e "  Ver status:    docker-compose -f docker-compose.prod.yml ps"
echo -e "  Parar:         docker-compose -f docker-compose.prod.yml down"
echo -e "  Restart:       docker-compose -f docker-compose.prod.yml restart"
echo ""

