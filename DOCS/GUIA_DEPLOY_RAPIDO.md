# 🚀 Guia de Deploy Rápido - Produção

Este é um guia resumido para fazer deploy rápido do Marketplace em produção.

## ⚡ Setup Rápido (10 minutos)

### 1. Preparar Servidor

```bash
# Conectar ao servidor
ssh usuario@seu-servidor

# Instalar Docker (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clonar e Configurar

```bash
# Criar diretório
sudo mkdir -p /var/www/marketplace
cd /var/www/marketplace

# Clonar repositório
git clone https://github.com/seu-usuario/marketplace.git .
sudo chown -R $USER:$USER .

# Copiar e editar variáveis de ambiente
cp env.production.example .env.production
nano .env.production
```

### 3. Configurar Variáveis Essenciais

Edite `.env.production` e mude:

```env
# Gerar senha forte do banco
POSTGRES_PASSWORD=SuaSenhaForte123!@#

# Gerar SECRET_KEY (execute no servidor):
# python3 -c "import secrets; print(secrets.token_urlsafe(64))"
SECRET_KEY=sua-chave-gerada-aqui

# Seu domínio
ALLOWED_ORIGINS=https://seudominio.com
NEXT_PUBLIC_API_URL=https://api.seudominio.com
DOMAIN=seudominio.com
SSL_EMAIL=seu-email@exemplo.com

# Senha Redis
REDIS_PASSWORD=SuaSenhaRedis123!@#
```

### 4. Deploy

```bash
# Dar permissão aos scripts
chmod +x scripts/*.sh

# Executar deploy
./scripts/deploy-prod.sh
```

### 5. Configurar SSL

```bash
# Configurar SSL com Let's Encrypt
./scripts/setup-ssl.sh
```

### 6. Configurar Firewall

```bash
# Instalar UFW
sudo apt install ufw -y

# Configurar regras
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## ✅ Verificação

Após o deploy, verifique:

```bash
# Status dos containers
docker compose -f docker-compose.prod.yml ps

# Logs
docker compose -f docker-compose.prod.yml logs -f

# Teste de endpoints
curl http://localhost/docs  # Backend API
curl http://localhost/      # Frontend
```

## 🌐 Acessar Aplicação

- **Frontend**: https://seudominio.com
- **Backend API**: https://seudominio.com/api
- **Documentação**: https://seudominio.com/docs

## 🔧 Comandos Úteis

```bash
# Ver status
docker compose -f docker-compose.prod.yml ps

# Ver logs
docker compose -f docker-compose.prod.yml logs -f

# Reiniciar
docker compose -f docker-compose.prod.yml restart

# Parar
docker compose -f docker-compose.prod.yml down

# Fazer backup
./scripts/backup-database.sh

# Monitorar sistema
./scripts/monitor.sh
```

## 🔄 Atualizar Aplicação

```bash
# Fazer backup
./scripts/backup-database.sh

# Atualizar
git pull origin main
./scripts/deploy-prod.sh
```

## 📦 Backup Automático

```bash
# Configurar backup diário às 2h
crontab -e

# Adicionar:
0 2 * * * /var/www/marketplace/scripts/backup-database.sh
```

## 🆘 Troubleshooting Rápido

### Container não inicia

```bash
# Ver logs
docker compose -f docker-compose.prod.yml logs nome-container

# Rebuild
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Erro 502 Bad Gateway

```bash
# Verificar backend
docker compose -f docker-compose.prod.yml logs backend

# Reiniciar nginx e backend
docker compose -f docker-compose.prod.yml restart nginx backend
```

### Banco de dados não conecta

```bash
# Verificar PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres pg_isready

# Reiniciar
docker compose -f docker-compose.prod.yml restart postgres backend
```

## 📚 Documentação Completa

Para configuração avançada, consulte:
- [CONFIGURACAO_PRODUCAO.md](./CONFIGURACAO_PRODUCAO.md) - Guia completo
- [COMANDOS_DOCKER.md](./COMANDOS_DOCKER.md) - Comandos Docker

## 🎯 Checklist Mínimo

- [ ] Docker instalado
- [ ] Repositório clonado
- [ ] `.env.production` configurado
- [ ] Senhas alteradas
- [ ] Deploy executado
- [ ] SSL configurado
- [ ] Firewall configurado
- [ ] Backup automático configurado
- [ ] Aplicação acessível

## 🎉 Pronto!

Seu Marketplace está em produção! 

Para suporte, consulte a documentação completa ou abra uma issue.

