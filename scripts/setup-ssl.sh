#!/bin/bash

# ========================================
# Script de Configuração SSL com Let's Encrypt
# ========================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Configuração SSL - Let's Encrypt${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Verificar se certbot está instalado
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}⚠️  Certbot não encontrado. Instalando...${NC}"
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install certbot
    else
        echo -e "${RED}❌ Sistema operacional não suportado${NC}"
        exit 1
    fi
fi

# Solicitar informações
read -p "Digite seu domínio (ex: exemplo.com): " DOMAIN
read -p "Digite seu email: " EMAIL

# Validar inputs
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Domínio e email são obrigatórios!${NC}"
    exit 1
fi

# Criar diretório para certificados
mkdir -p nginx/ssl
mkdir -p /var/www/certbot

echo -e "${GREEN}📝 Configurando certificado SSL para $DOMAIN${NC}"

# Obter certificado
sudo certbot certonly \
    --standalone \
    --preferred-challenges http \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Copiar certificados para o diretório nginx
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/
sudo chmod 644 nginx/ssl/*.pem

echo -e "${GREEN}✅ Certificado SSL obtido com sucesso!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Atualize o nginx/conf.d/marketplace.conf com seu domínio"
echo "2. Reinicie o Nginx: docker-compose -f docker-compose.prod.yml restart nginx"
echo "3. Configure renovação automática (cron job)"
echo ""
echo -e "${YELLOW}🔄 Para renovação automática, adicione ao crontab:${NC}"
echo "0 0 1 * * certbot renew --quiet --deploy-hook 'docker-compose -f /caminho/para/projeto/docker-compose.prod.yml restart nginx'"

