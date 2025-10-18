#!/bin/bash

# ========================================
# Script de Restauração do Banco de Dados
# ========================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Restauração do Banco de Dados${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

BACKUP_DIR="./backend/backups"

# Listar backups disponíveis
echo -e "${YELLOW}📂 Backups disponíveis:${NC}"
ls -lh $BACKUP_DIR/*.gz 2>/dev/null || {
    echo -e "${RED}❌ Nenhum backup encontrado em $BACKUP_DIR${NC}"
    exit 1
}

echo ""
read -p "Digite o nome do arquivo de backup (com .gz): " BACKUP_FILE

if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo -e "${RED}❌ Arquivo não encontrado: ${BACKUP_DIR}/${BACKUP_FILE}${NC}"
    exit 1
fi

# Confirmação
echo ""
echo -e "${RED}⚠️  ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados atuais!${NC}"
read -p "Tem certeza que deseja continuar? (digite 'SIM' para confirmar): " CONFIRM

if [ "$CONFIRM" != "SIM" ]; then
    echo -e "${YELLOW}Operação cancelada.${NC}"
    exit 0
fi

# Fazer backup de segurança antes de restaurar
echo -e "${GREEN}📦 Criando backup de segurança antes da restauração...${NC}"
SAFETY_BACKUP="marketplace_safety_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump \
    -U marketplace_user \
    -d marketplace_db \
    --format=custom \
    --compress=9 \
    | gzip > "${BACKUP_DIR}/${SAFETY_BACKUP}"

# Descompactar backup
echo -e "${GREEN}🗜️  Descompactando backup...${NC}"
TEMP_FILE="${BACKUP_DIR}/temp_restore.sql"
gunzip -c "${BACKUP_DIR}/${BACKUP_FILE}" > "$TEMP_FILE"

# Restaurar banco
echo -e "${GREEN}🔄 Restaurando banco de dados...${NC}"
docker-compose -f docker-compose.prod.yml exec -T postgres pg_restore \
    -U marketplace_user \
    -d marketplace_db \
    --clean \
    --if-exists \
    < "$TEMP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Restauração concluída com sucesso!${NC}"
    rm "$TEMP_FILE"
    
    # Reiniciar backend
    echo -e "${GREEN}🔄 Reiniciando backend...${NC}"
    docker-compose -f docker-compose.prod.yml restart backend
    
    echo -e "${GREEN}✅ Sistema restaurado!${NC}"
else
    echo -e "${RED}❌ Erro ao restaurar banco!${NC}"
    echo -e "${YELLOW}Backup de segurança disponível em: ${SAFETY_BACKUP}${NC}"
    rm "$TEMP_FILE"
    exit 1
fi

