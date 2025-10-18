# 🔒 Guia de Segurança para Produção

Este documento detalha todas as medidas de segurança necessárias para rodar o Marketplace em produção.

## 📋 Índice

1. [Checklist de Segurança](#checklist-de-segurança)
2. [Configuração de Senhas](#configuração-de-senhas)
3. [SSL/TLS](#ssltls)
4. [Firewall](#firewall)
5. [Containers](#containers)
6. [Banco de Dados](#banco-de-dados)
7. [Aplicação](#aplicação)
8. [Monitoramento](#monitoramento)
9. [Backups](#backups)
10. [Auditoria](#auditoria)

---

## ✅ Checklist de Segurança

### Antes do Deploy

- [ ] Todas as senhas foram alteradas
- [ ] SECRET_KEY única foi gerada
- [ ] SSL/HTTPS está configurado
- [ ] Firewall está ativo
- [ ] Portas desnecessárias estão fechadas
- [ ] Debug mode está desabilitado
- [ ] CORS está configurado corretamente
- [ ] Usuários não-root nos containers
- [ ] Rate limiting está ativo
- [ ] Headers de segurança configurados

### Após o Deploy

- [ ] Teste de penetração básico executado
- [ ] Logs estão sendo coletados
- [ ] Backup automático configurado
- [ ] Monitoramento está ativo
- [ ] SSL válido e renovação automática configurada
- [ ] Atualizações de segurança aplicadas

---

## 🔐 Configuração de Senhas

### 1. Banco de Dados PostgreSQL

```bash
# Gerar senha forte
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Ou usando openssl
openssl rand -base64 32
```

Atualizar em `.env.production`:
```env
POSTGRES_PASSWORD=senha_gerada_aqui
```

### 2. SECRET_KEY do Backend

```bash
# Gerar SECRET_KEY (64 caracteres)
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

Atualizar em `.env.production`:
```env
SECRET_KEY=chave_gerada_aqui
```

### 3. Redis

```bash
# Gerar senha Redis
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Atualizar em `.env.production`:
```env
REDIS_PASSWORD=senha_gerada_aqui
```

### Requisitos de Senhas Fortes

- ✅ Mínimo 32 caracteres
- ✅ Combinação de letras, números e símbolos
- ✅ Única para cada serviço
- ✅ Nunca reutilizar senhas
- ✅ Armazenar em local seguro (gerenciador de senhas)
- ❌ Nunca commitar no Git

---

## 🔒 SSL/TLS

### Configuração Let's Encrypt

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado
sudo certbot certonly --standalone \
  -d seudominio.com \
  -d www.seudominio.com \
  --email seu-email@exemplo.com \
  --agree-tos

# Copiar certificados
sudo cp /etc/letsencrypt/live/seudominio.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/seudominio.com/privkey.pem nginx/ssl/
sudo chmod 644 nginx/ssl/*.pem
```

### Renovação Automática

```bash
# Testar renovação
sudo certbot renew --dry-run

# Configurar cron para renovação automática
sudo crontab -e

# Adicionar (renova todo dia 1 às 00:00)
0 0 1 * * certbot renew --quiet --deploy-hook 'docker compose -f /var/www/marketplace/docker-compose.prod.yml restart nginx'
```

### Verificar Configuração SSL

```bash
# Teste online
# https://www.ssllabs.com/ssltest/

# Verificar certificado
openssl s_client -connect seudominio.com:443 -servername seudominio.com < /dev/null

# Verificar expiração
openssl x509 -in nginx/ssl/fullchain.pem -noout -dates
```

### Configurações SSL Recomendadas

O arquivo `nginx/nginx.conf` já inclui:

- ✅ TLS 1.2 e 1.3 apenas
- ✅ Ciphers modernos e seguros
- ✅ HSTS habilitado
- ✅ Session tickets desabilitado
- ✅ OCSP stapling

---

## 🛡️ Firewall

### Configuração UFW (Ubuntu)

```bash
# Instalar UFW
sudo apt install ufw

# Configurar regras padrão
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir SSH (IMPORTANTE - não se tranque!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Verificar status
sudo ufw status verbose
```

### Regras Adicionais

```bash
# Limitar tentativas de SSH (proteção brute force)
sudo ufw limit ssh

# Permitir apenas IPs específicos para SSH (opcional)
sudo ufw delete allow ssh
sudo ufw allow from SEU_IP to any port 22

# Bloquear IP específico
sudo ufw deny from IP_MALICIOSO
```

### Verificar Portas Abertas

```bash
# Ver portas em uso
sudo netstat -tulpn | grep LISTEN

# Ou com ss
sudo ss -tulpn | grep LISTEN

# Scan de portas (de outro servidor)
nmap -p- seudominio.com
```

---

## 🐳 Containers

### Segurança dos Containers

#### 1. Usuários Não-Root

Os Dockerfiles já incluem usuários não-root:

**Backend (Python):**
```dockerfile
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
```

**Frontend (Node):**
```dockerfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
```

#### 2. Limites de Recursos

Configurado em `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 256M
```

#### 3. Scan de Vulnerabilidades

```bash
# Instalar Trivy
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt update
sudo apt install trivy

# Scan das imagens
trivy image marketplace_backend_prod
trivy image marketplace_frontend_prod
trivy image postgres:16-alpine
```

#### 4. Redes Isoladas

```yaml
networks:
  marketplace_network_prod:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 🗄️ Banco de Dados

### Segurança PostgreSQL

#### 1. Acesso Restrito

```yaml
# docker-compose.prod.yml
postgres:
  ports:
    - "127.0.0.1:5432:5432"  # Apenas localhost
```

#### 2. Configurações de Segurança

```bash
# Conectar ao PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres psql -U marketplace_user -d marketplace_db

# Configurações recomendadas
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_duration = on;

# Aplicar mudanças
SELECT pg_reload_conf();
```

#### 3. Backup Criptografado

```bash
# Backup com criptografia
docker compose -f docker-compose.prod.yml exec postgres pg_dump \
  -U marketplace_user marketplace_db \
  --format=custom \
  --compress=9 \
  | gpg --encrypt --recipient seu-email@exemplo.com \
  > backup_encrypted.sql.gpg

# Restaurar backup criptografado
gpg --decrypt backup_encrypted.sql.gpg \
  | docker compose -f docker-compose.prod.yml exec -T postgres pg_restore \
    -U marketplace_user -d marketplace_db --clean
```

#### 4. Auditoria

```sql
-- Criar tabela de auditoria
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(50),
    table_name VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    details JSONB
);

-- Criar índice
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_user ON audit_log(user_id);
```

---

## 🔐 Aplicação

### Headers de Segurança

Já configurados em `nginx/conf.d/marketplace.conf`:

```nginx
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

### Rate Limiting

Configurado no Nginx:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;
limit_conn_zone $binary_remote_addr zone=addr:10m;
```

### CORS

Configurado em `.env.production`:

```env
# Apenas seus domínios
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
```

### Validação de Input

Backend já inclui validação com Pydantic:

```python
from pydantic import BaseModel, EmailStr, constr

class UsuarioCreate(BaseModel):
    email: EmailStr
    senha: constr(min_length=8, max_length=100)
    nome_completo: constr(min_length=3, max_length=100)
```

---

## 📊 Monitoramento

### Logs de Segurança

```bash
# Ver logs de acesso Nginx
docker compose -f docker-compose.prod.yml exec nginx tail -f /var/log/nginx/access.log

# Ver logs de erro
docker compose -f docker-compose.prod.yml exec nginx tail -f /var/log/nginx/error.log

# Filtrar requisições suspeitas
docker compose -f docker-compose.prod.yml logs nginx | grep -E "(404|403|500)"
```

### Fail2Ban

```bash
# Instalar Fail2Ban
sudo apt install fail2ban -y

# Configurar para Nginx
sudo nano /etc/fail2ban/jail.local
```

Adicionar:
```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

### Alertas

```bash
# Instalar mailutils
sudo apt install mailutils -y

# Script de alerta
cat > /usr/local/bin/check-security.sh << 'EOF'
#!/bin/bash
ERRORS=$(docker compose -f /var/www/marketplace/docker-compose.prod.yml logs --since 1h | grep -i "error\|failed\|denied" | wc -l)

if [ $ERRORS -gt 50 ]; then
    echo "Detectados $ERRORS erros na última hora" | mail -s "Alerta Segurança Marketplace" seu-email@exemplo.com
fi
EOF

chmod +x /usr/local/bin/check-security.sh

# Adicionar ao cron (verificar a cada hora)
echo "0 * * * * /usr/local/bin/check-security.sh" | crontab -
```

---

## 💾 Backups

### Estratégia de Backup

1. **Backup Diário** - Retém 7 dias
2. **Backup Semanal** - Retém 4 semanas
3. **Backup Mensal** - Retém 12 meses

```bash
# Backup diário (já configurado)
0 2 * * * /var/www/marketplace/scripts/backup-database.sh

# Backup semanal
0 3 * * 0 /var/www/marketplace/scripts/backup-database.sh && cp backup.sql.gz backup_weekly_$(date +\%Y\%m\%d).sql.gz

# Backup mensal
0 4 1 * * /var/www/marketplace/scripts/backup-database.sh && cp backup.sql.gz backup_monthly_$(date +\%Y\%m).sql.gz
```

### Teste de Restauração

```bash
# Testar restauração regularmente (mensalmente)
# Em ambiente de teste
./scripts/restore-database.sh
```

### Backup Offsite

```bash
# AWS S3
aws s3 sync ./backend/backups s3://seu-bucket/marketplace-backups/

# Google Cloud Storage
gsutil -m rsync -r ./backend/backups gs://seu-bucket/marketplace-backups/

# Rsync para servidor remoto
rsync -avz --delete ./backend/backups/ usuario@servidor-backup:/backups/marketplace/
```

---

## 🔍 Auditoria

### Log de Acessos

```bash
# Analisar logs de acesso
docker compose -f docker-compose.prod.yml logs nginx | awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# IPs mais ativos
docker compose -f docker-compose.prod.yml logs nginx | grep -oP '\d+\.\d+\.\d+\.\d+' | sort | uniq -c | sort -rn | head -20

# User agents suspeitos
docker compose -f docker-compose.prod.yml logs nginx | grep -i "bot\|crawler\|scanner" | wc -l
```

### Verificação de Integridade

```bash
# Hash dos arquivos críticos
find backend/app -type f -name "*.py" -exec sha256sum {} \; > checksums.txt

# Verificar mudanças não autorizadas
sha256sum -c checksums.txt
```

### Auditoria de Segurança

```bash
# Verificar permissões de arquivos
find . -type f -perm /o+w -ls  # Arquivos com write para others

# Verificar arquivos com SUID
find / -perm -4000 -type f 2>/dev/null

# Verificar portas abertas
sudo netstat -tulpn | grep LISTEN
```

---

## 🚨 Resposta a Incidentes

### Procedimento em Caso de Comprometimento

1. **Isolar o sistema**
   ```bash
   # Parar aplicação
   docker compose -f docker-compose.prod.yml down
   
   # Bloquear tráfego
   sudo ufw deny in
   ```

2. **Coletar evidências**
   ```bash
   # Exportar todos os logs
   docker compose -f docker-compose.prod.yml logs > incident_logs.txt
   
   # Backup do estado atual
   ./scripts/backup-database.sh
   ```

3. **Análise**
   ```bash
   # Verificar logs suspeitos
   grep -i "failed\|denied\|unauthorized" incident_logs.txt
   
   # Verificar conexões ativas
   docker compose -f docker-compose.prod.yml exec postgres \
     psql -U marketplace_user -d marketplace_db \
     -c "SELECT * FROM pg_stat_activity;"
   ```

4. **Recuperação**
   ```bash
   # Restaurar backup limpo
   ./scripts/restore-database.sh
   
   # Atualizar senhas
   # Rebuild containers
   docker compose -f docker-compose.prod.yml build --no-cache
   docker compose -f docker-compose.prod.yml up -d
   
   # Reativar firewall
   sudo ufw enable
   ```

---

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## ✅ Checklist Final de Segurança

- [ ] Todas as senhas foram alteradas
- [ ] SECRET_KEY única gerada
- [ ] SSL/HTTPS configurado e funcionando
- [ ] Firewall ativo (apenas 22, 80, 443)
- [ ] PostgreSQL não exposto externamente
- [ ] Usuários não-root nos containers
- [ ] Rate limiting configurado
- [ ] Headers de segurança ativos
- [ ] CORS configurado corretamente
- [ ] Debug mode desabilitado
- [ ] Backups automáticos configurados
- [ ] Monitoramento ativo
- [ ] Fail2Ban configurado
- [ ] Logs sendo coletados
- [ ] Scan de vulnerabilidades executado
- [ ] Auditoria de segurança realizada
- [ ] Plano de resposta a incidentes documentado

---

**🔒 Segurança é um processo contínuo, não um destino!**

Revise este guia regularmente e mantenha-se atualizado sobre novas ameaças e melhores práticas.

