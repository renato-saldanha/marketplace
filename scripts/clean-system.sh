#!/bin/bash

# ========================================
# Script de Limpeza do Sistema Docker
# ========================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Limpeza do Sistema Docker${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Mostrar uso atual
echo -e "${YELLOW}📊 Uso atual do Docker:${NC}"
docker system df
echo ""

# Menu de opções
echo -e "${YELLOW}Escolha o tipo de limpeza:${NC}"
echo "1) Limpeza leve (apenas containers parados)"
echo "2) Limpeza média (containers parados + imagens não usadas)"
echo "3) Limpeza completa (tudo que não está em uso)"
echo "4) Limpeza agressiva (TUDO - CUIDADO!)"
echo "5) Limpar apenas logs"
echo "6) Cancelar"
echo ""

read -p "Opção [1-6]: " option

case $option in
    1)
        echo -e "${GREEN}🧹 Realizando limpeza leve...${NC}"
        docker container prune -f
        ;;
    2)
        echo -e "${GREEN}🧹 Realizando limpeza média...${NC}"
        docker container prune -f
        docker image prune -f
        ;;
    3)
        echo -e "${YELLOW}⚠️  Esta operação irá remover:${NC}"
        echo "  - Containers parados"
        echo "  - Imagens não usadas"
        echo "  - Redes não usadas"
        echo "  - Cache de build"
        echo ""
        read -p "Confirma? (s/N): " confirm
        if [ "$confirm" == "s" ] || [ "$confirm" == "S" ]; then
            echo -e "${GREEN}🧹 Realizando limpeza completa...${NC}"
            docker system prune -a -f
        else
            echo -e "${YELLOW}Operação cancelada${NC}"
        fi
        ;;
    4)
        echo -e "${RED}⚠️  ATENÇÃO: Esta operação é DESTRUTIVA!${NC}"
        echo -e "${RED}Irá remover TUDO, incluindo volumes (dados do banco)${NC}"
        echo ""
        read -p "Digite 'CONFIRMO' para continuar: " confirm
        if [ "$confirm" == "CONFIRMO" ]; then
            echo -e "${RED}🧹 Realizando limpeza agressiva...${NC}"
            docker system prune -a --volumes -f
        else
            echo -e "${YELLOW}Operação cancelada${NC}"
        fi
        ;;
    5)
        echo -e "${GREEN}🧹 Limpando logs do Docker...${NC}"
        if [ -d "/var/lib/docker/containers" ]; then
            echo "Necessário permissão sudo para limpar logs"
            sudo sh -c "truncate -s 0 /var/lib/docker/containers/*/*-json.log"
            echo -e "${GREEN}✅ Logs limpos${NC}"
        else
            echo -e "${RED}❌ Diretório de logs não encontrado${NC}"
        fi
        ;;
    6)
        echo -e "${YELLOW}Operação cancelada${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Limpeza concluída!${NC}"
echo ""
echo -e "${YELLOW}📊 Uso após limpeza:${NC}"
docker system df

