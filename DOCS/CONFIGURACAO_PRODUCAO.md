# 🚀 Configuração para Produção - Marketplace

Este guia completo explica como configurar e fazer deploy do Marketplace em ambiente de produção.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
4. [Configuração SSL/HTTPS](#configuração-sslhttps)
5. [Deploy](#deploy)
6. [Backup e Restauração](#backup-e-restauração)
7. [Monitoramento](#monitoramento)
8. [Segurança](#segurança)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Servidor

- **Sistema Operacional**: Ubuntu 20.04+ (recomendado) ou similar
- **RAM**: Mínimo 4GB, recomendado 8GB+
- **CPU**: Mínimo 2 cores, recomendado 4+
- **Disco**: Mínimo 20GB, recomendado 50GB+
- **Docker**: v20.10+
- **Docker Compose**: v2.0+

### Domínio

- Domínio registrado apontando para o IP do servidor
- Acesso DNS para configuração

### Instalação Docker (Ubuntu)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

---

## ⚙️ Configuração Inicial

### 1. Clone do Repositório

```bash
# Criar diretório
sudo mkdir -p /var/www/marketplace
cd /var/www/marketplace

# Clonar repositório
git clone https://github.com/seu-usuario/marketplace.git .

# Dar permissões
sudo chown -R $USER:$USER .
```

### 2. Configurar Firewall

```bash
# Instalar UFW
sudo apt install ufw

# Configurar regras
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable
sudo ufw status
```

---

## 🔐 Configuração de Variáveis de Ambiente

### 1. Copiar arquivo de exemplo

```bash
cp .env.production.example .env.production
```

### 2. Gerar SECRET_KEY segura

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 3. Editar .env.production

```bash
nano .env.production
```

**Configurações obrigatórias para alterar:**

```env
# Banco de Dados - USE SENHAS FORTES!
POSTGRES_PASSWORD=sua_senha_super_segura_aqui

# Backend - Gere com o comando acima
SECRET_KEY=sua_chave_secreta_gerada_aqui

# CORS - Seus domínios
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com

# URL da API
NEXT_PUBLIC_API_URL=https://api.seudominio.com

# Redis
REDIS_PASSWORD=sua_senha_redis_aqui

# Domínio
DOMAIN=seudominio.com
SSL_EMAIL=seu-email@seudominio.com
```

### 4. Proteger arquivo de ambiente

```bash
chmod 600 .env.production
```

---

## 🔒 Configuração SSL/HTTPS

### Opção 1: Let's Encrypt (Recomendado)

```bash
# Dar permissão ao script
chmod +x scripts/setup-ssl.sh

# Executar configuração SSL
./scripts/setup-ssl.sh
```

O script irá:
1. Instalar Certbot
2. Obter certificado SSL gratuito
3. Configurar renovação automática

### Opção 2: Certificado Próprio

Se você já possui certificados SSL:

```bash
# Copiar certificados
sudo cp seu_fullchain.pem nginx/ssl/fullchain.pem
sudo cp sua_privkey.pem nginx/ssl/privkey.pem

# Ajustar permissões
sudo chmod 644 nginx/ssl/*.pem
```

### Configurar Renovação Automática

```bash
# Editar crontab
crontab -e

# Adicionar linha (renova todo dia 1 às 00:00)
0 0 1 * * certbot renew --quiet --deploy-hook 'docker compose -f /var/www/marketplace/docker-compose.prod.yml restart nginx'
```

### Atualizar configuração do Nginx

```bash
# Editar arquivo de configuração
nano nginx/conf.d/marketplace.conf

# Substituir "server_name _;" por:
server_name seudominio.com www.seudominio.com;
```

---

## 🚀 Deploy

### Deploy Inicial

```bash
# Dar permissão aos scripts
chmod +x scripts/deploy-prod.sh
chmod +x scripts/backup-database.sh
chmod +x scripts/restore-database.sh

# Executar deploy
./scripts/deploy-prod.sh
```

O script irá:
1. ✅ Fazer backup do banco (se existir)
2. ✅ Parar containers antigos
3. ✅ Construir novas imagens
4. ✅ Iniciar containers
5. ✅ Executar migrações
6. ✅ Verificar saúde do sistema

### Deploy Manual

```bash
# 1. Fazer backup
./scripts/backup-database.sh

# 2. Parar containers
docker compose -f docker-compose.prod.yml down

# 3. Atualizar código
git pull origin main

# 4. Build
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VERSION=$(git describe --tags --always)

docker compose -f docker-compose.prod.yml build \
    --build-arg BUILD_DATE=$BUILD_DATE \
    --build-arg VERSION=$VERSION

# 5. Iniciar
docker compose -f docker-compose.prod.yml up -d

# 6. Executar migrações
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head

# 7. Verificar
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

---

## 💾 Backup e Restauração

### Backup Automático

```bash
# Configurar backup diário às 2h da manhã
crontab -e

# Adicionar:
0 2 * * * /var/www/marketplace/scripts/backup-database.sh
```

### Backup Manual

```bash
./scripts/backup-database.sh
```

### Restaurar Backup

```bash
./scripts/restore-database.sh
```

### Backup para Armazenamento Externo

```bash
# AWS S3
aws s3 sync ./backend/backups s3://seu-bucket/marketplace-backups/

# Rsync para servidor remoto
rsync -avz --delete ./backend/backups/ usuario@servidor-backup:/backups/marketplace/
```

---

## 📊 Monitoramento

### Ver Logs

```bash
# Todos os serviços
docker compose -f docker-compose.prod.yml logs -f

# Serviço específico
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Status dos Containers

```bash
docker compose -f docker-compose.prod.yml ps
```

### Uso de Recursos

```bash
# Recursos em tempo real
docker stats

# Espaço em disco
docker system df
df -h
```

### Health Checks

```bash
# PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U marketplace_user

# Backend
curl http://localhost/api/docs

# Frontend
curl http://localhost/
```

### Monitoramento Avançado (Opcional)

#### Prometheus + Grafana

```bash
# Adicionar ao docker-compose.prod.yml
# Ver exemplo em: https://github.com/stefanprodan/dockprom
```

#### Sentry (Rastreamento de Erros)

1. Criar conta em https://sentry.io
2. Obter DSN do projeto
3. Adicionar ao `.env.production`:
   ```env
   SENTRY_DSN=https://seu-dsn@sentry.io/projeto
   ```

---

## 🛡️ Segurança

### Checklist de Segurança

- [ ] Senhas fortes em todas as variáveis de ambiente
- [ ] SECRET_KEY única e aleatória
- [ ] SSL/HTTPS configurado
- [ ] Firewall configurado (apenas portas 22, 80, 443)
- [ ] PostgreSQL não exposto externamente (apenas localhost)
- [ ] Backups automáticos configurados
- [ ] Atualizações de segurança do sistema
- [ ] Rate limiting configurado no Nginx
- [ ] Headers de segurança configurados
- [ ] Usuários não-root nos containers

### Atualizações de Segurança

```bash
# Atualizar sistema operacional
sudo apt update && sudo apt upgrade -y

# Atualizar Docker
sudo apt install --only-upgrade docker-ce docker-ce-cli containerd.io

# Atualizar dependências do projeto
git pull origin main
./scripts/deploy-prod.sh
```

### Hardening do Servidor

```bash
# Desabilitar login root via SSH
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Instalar Fail2Ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configurar logrotate
sudo nano /etc/logrotate.d/marketplace
```

---

## 🔧 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker compose -f docker-compose.prod.yml logs container_name

# Verificar configuração
docker compose -f docker-compose.prod.yml config

# Rebuild do zero
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Erro de conexão com banco

```bash
# Verificar status do PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres pg_isready

# Verificar logs
docker compose -f docker-compose.prod.yml logs postgres

# Reiniciar
docker compose -f docker-compose.prod.yml restart postgres backend
```

### SSL não funciona

```bash
# Verificar certificados
ls -la nginx/ssl/

# Testar configuração do Nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -t

# Renovar certificado
sudo certbot renew --force-renewal
```

### Alto uso de memória

```bash
# Ver uso atual
docker stats

# Limpar cache
docker system prune -a --volumes

# Ajustar limites no docker-compose.prod.yml
```

### Logs muito grandes

```bash
# Limpar logs do Docker
sudo sh -c "truncate -s 0 /var/lib/docker/containers/*/*-json.log"

# Configurar rotação de logs
sudo nano /etc/docker/daemon.json
```

Adicionar:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

---

## 📈 Performance

### Otimizações Recomendadas

1. **PostgreSQL**
   ```sql
   -- Ajustar configurações (dentro do container)
   ALTER SYSTEM SET shared_buffers = '256MB';
   ALTER SYSTEM SET effective_cache_size = '1GB';
   ALTER SYSTEM SET maintenance_work_mem = '64MB';
   SELECT pg_reload_conf();
   ```

2. **Redis Cache**
   - Já configurado no docker-compose.prod.yml
   - Use para cache de sessões e queries frequentes

3. **Nginx**
   - Gzip habilitado
   - Cache de assets estáticos
   - Rate limiting configurado

4. **Next.js**
   - Build otimizado para produção
   - Imagens otimizadas automaticamente
   - Code splitting habilitado

---

## 🔄 Atualizações

### Atualizar Aplicação

```bash
# 1. Fazer backup
./scripts/backup-database.sh

# 2. Atualizar código
git pull origin main

# 3. Executar deploy
./scripts/deploy-prod.sh
```

### Rollback

```bash
# Voltar para versão anterior
git log --oneline  # Ver commits
git checkout <commit-hash>
./scripts/deploy-prod.sh
```

---

## 📞 Suporte

### Comandos Úteis

```bash
# Status completo
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml top

# Entrar no container
docker compose -f docker-compose.prod.yml exec backend sh
docker compose -f docker-compose.prod.yml exec postgres psql -U marketplace_user -d marketplace_db

# Verificar variáveis de ambiente
docker compose -f docker-compose.prod.yml exec backend env

# Exportar logs
docker compose -f docker-compose.prod.yml logs > logs_$(date +%Y%m%d).txt
```

### Informações de Debug

Ao reportar problemas, inclua:

```bash
# Coletar informações
cat << EOF > debug_info.txt
=== System Info ===
$(uname -a)
$(docker --version)
$(docker compose version)

=== Container Status ===
$(docker compose -f docker-compose.prod.yml ps)

=== Docker Stats ===
$(docker stats --no-stream)

=== Recent Logs ===
$(docker compose -f docker-compose.prod.yml logs --tail=100)

=== Disk Usage ===
$(df -h)
$(docker system df)
EOF
```

---

## ✅ Checklist Final

Antes de colocar em produção:

- [ ] Variáveis de ambiente configuradas
- [ ] Senhas alteradas
- [ ] SSL/HTTPS funcionando
- [ ] Firewall configurado
- [ ] Backups automáticos configurados
- [ ] Domínio apontando corretamente
- [ ] Testes de carga realizados
- [ ] Monitoramento configurado
- [ ] Documentação atualizada
- [ ] Plano de rollback definido

---

**🎉 Seu Marketplace está pronto para produção!**

Para suporte adicional, consulte a documentação em `/DOCS/` ou abra uma issue no repositório.

