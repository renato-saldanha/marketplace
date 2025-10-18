#!/bin/bash

# ========================================
# Script de Backup do Banco de Dados
# ========================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Backup do Banco de Dados${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Configurações
BACKUP_DIR="./backend/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="marketplace_backup_${TIMESTAMP}.sql"
RETENTION_DAYS=7

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Fazer backup
echo -e "${GREEN}📦 Criando backup do banco de dados...${NC}"
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump \
    -U marketplace_user \
    -d marketplace_db \
    --format=custom \
    --compress=9 \
    > "${BACKUP_DIR}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup criado com sucesso: ${BACKUP_FILE}${NC}"
    
    # Comprimir backup
    echo -e "${GREEN}🗜️  Comprimindo backup...${NC}"
    gzip "${BACKUP_DIR}/${BACKUP_FILE}"
    
    # Calcular tamanho
    SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}.gz" | cut -f1)
    echo -e "${GREEN}📊 Tamanho do backup: ${SIZE}${NC}"
    
    # Remover backups antigos
    echo -e "${YELLOW}🧹 Removendo backups com mais de ${RETENTION_DAYS} dias...${NC}"
    find $BACKUP_DIR -name "marketplace_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    
    echo -e "${GREEN}✅ Backup concluído!${NC}"
else
    echo -e "${RED}❌ Erro ao criar backup!${NC}"
    exit 1
fi

# Listar backups disponíveis
echo ""
echo -e "${YELLOW}📂 Backups disponíveis:${NC}"
ls -lh $BACKUP_DIR/*.gz 2>/dev/null || echo "Nenhum backup encontrado"

