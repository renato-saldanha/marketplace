# 📜 Scripts de Produção

Coleção de scripts úteis para gerenciamento do Marketplace em produção.

## 📋 Lista de Scripts

### 🚀 Deploy

#### `deploy-prod.sh` / `deploy-prod.ps1`
Script principal de deploy para produção.

**Uso:**
```bash
./scripts/deploy-prod.sh
```

**O que faz:**
- ✅ Verifica branch e commits
- ✅ Faz backup do banco antes do deploy
- ✅ Para containers antigos
- ✅ Atualiza código (git pull)
- ✅ Constrói novas imagens Docker
- ✅ Inicia containers
- ✅ Executa migrações do banco
- ✅ Testa conectividade

---

### 💾 Backup e Restauração

#### `backup-database.sh`
Cria backup do banco de dados PostgreSQL.

**Uso:**
```bash
./scripts/backup-database.sh
```

**Características:**
- ✅ Backup comprimido (gzip)
- ✅ Remove backups antigos (> 7 dias)
- ✅ Formato custom do PostgreSQL
- ✅ Timestamped

**Localização dos backups:**
```
./backend/backups/marketplace_backup_YYYYMMDD_HHMMSS.sql.gz
```

#### `restore-database.sh`
Restaura backup do banco de dados.

**Uso:**
```bash
./scripts/restore-database.sh
```

**Características:**
- ✅ Lista backups disponíveis
- ✅ Confirmação obrigatória (segurança)
- ✅ Cria backup de segurança antes de restaurar
- ✅ Reinicia backend após restauração

---

### 🔒 SSL/Segurança

#### `setup-ssl.sh`
Configura certificado SSL com Let's Encrypt.

**Uso:**
```bash
./scripts/setup-ssl.sh
```

**O que faz:**
- ✅ Instala Certbot (se necessário)
- ✅ Obtém certificado SSL gratuito
- ✅ Copia certificados para pasta nginx
- ✅ Configura renovação automática

**Requisitos:**
- Domínio apontando para o servidor
- Porta 80 aberta
- Email válido

---

### 📊 Monitoramento

#### `monitor.sh`
Monitora saúde do sistema e containers.

**Uso básico:**
```bash
./scripts/monitor.sh
```

**Modo contínuo (atualiza a cada 60s):**
```bash
./scripts/monitor.sh --watch
```

**O que verifica:**
- ✅ Status dos containers
- ✅ Health checks
- ✅ Uso de disco
- ✅ Uso de memória
- ✅ Endpoints (backend/frontend)
- ✅ Conexões do banco de dados
- ✅ Tamanho dos logs

**Alertas:**
Configure email no script para receber alertas:
```bash
ALERT_EMAIL="seu-email@exemplo.com"
```

---

### 🧹 Limpeza

#### `clean-system.sh`
Limpa recursos Docker não utilizados.

**Uso:**
```bash
./scripts/clean-system.sh
```

**Opções:**
1. **Limpeza leve** - Remove apenas containers parados
2. **Limpeza média** - Containers + imagens não usadas
3. **Limpeza completa** - Tudo não usado (exceto volumes)
4. **Limpeza agressiva** - TUDO incluindo volumes (⚠️ CUIDADO!)
5. **Limpar logs** - Apenas logs do Docker

**Recomendação:**
Execute mensalmente a opção 2 ou 3 para liberar espaço.

---

## 🔧 Configuração dos Scripts

### Dar Permissão de Execução

```bash
# Todos os scripts de uma vez
chmod +x scripts/*.sh

# Script específico
chmod +x scripts/deploy-prod.sh
```

### Windows (PowerShell)

Para executar scripts `.ps1`:

```powershell
# Permitir execução de scripts (executar como Admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Executar script
.\scripts\deploy-prod.ps1
```

---

## 📅 Automação com Cron

### Backup Diário

```bash
# Editar crontab
crontab -e

# Adicionar (backup às 2h da manhã)
0 2 * * * /var/www/marketplace/scripts/backup-database.sh
```

### Monitoramento Contínuo

```bash
# Verificar saúde a cada hora
0 * * * * /var/www/marketplace/scripts/monitor.sh
```

### Limpeza Mensal

```bash
# Limpeza automática no dia 1 de cada mês às 3h
0 3 1 * * /var/www/marketplace/scripts/clean-system.sh <<< "2"
```

### Renovação SSL

```bash
# Renovar SSL no dia 1 de cada mês
0 0 1 * * certbot renew --quiet --deploy-hook 'docker compose -f /var/www/marketplace/docker-compose.prod.yml restart nginx'
```

---

## 🛠️ Customização

### Deploy Script

Edite `deploy-prod.sh` para adicionar passos personalizados:

```bash
# Adicionar após linha 50
# Seu código customizado aqui
echo "Executando testes..."
docker compose -f docker-compose.prod.yml exec backend pytest
```

### Backup Script

Ajuste retenção de backups em `backup-database.sh`:

```bash
# Linha 14
RETENTION_DAYS=7  # Altere para 30, 60, etc
```

### Monitor Script

Configure alertas em `monitor.sh`:

```bash
# Linha 10
ALERT_EMAIL="seu-email@exemplo.com"

# Ajustar limites
check_disk_space() {
    # Linha 45 - Alerta em 80% em vez de 90%
    if [ $usage -lt 80 ]; then
```

---

## 🚨 Troubleshooting

### Script não executa

```bash
# Verificar permissões
ls -la scripts/

# Dar permissão
chmod +x scripts/nome-do-script.sh

# Verificar shebang (primeira linha)
head -1 scripts/nome-do-script.sh
# Deve ser: #!/bin/bash
```

### Erro de "command not found"

```bash
# Verificar se comando existe
which docker
which docker-compose

# Instalar Docker Compose se necessário
sudo apt install docker-compose-plugin
```

### Cron não executa

```bash
# Verificar logs do cron
grep CRON /var/log/syslog

# Usar caminho absoluto no crontab
0 2 * * * /usr/bin/bash /var/www/marketplace/scripts/backup-database.sh

# Adicionar output para debug
0 2 * * * /var/www/marketplace/scripts/backup-database.sh >> /tmp/backup.log 2>&1
```

---

## 📖 Exemplos de Uso

### Deploy Completo

```bash
# 1. Fazer backup manual antes
./scripts/backup-database.sh

# 2. Executar deploy
./scripts/deploy-prod.sh

# 3. Monitorar após deploy
./scripts/monitor.sh --watch
```

### Manutenção Semanal

```bash
# 1. Backup
./scripts/backup-database.sh

# 2. Verificar saúde
./scripts/monitor.sh

# 3. Limpar sistema
./scripts/clean-system.sh
# Escolher opção 2

# 4. Verificar logs
docker compose -f docker-compose.prod.yml logs --tail=100
```

### Recuperação de Desastre

```bash
# 1. Parar sistema
docker compose -f docker-compose.prod.yml down

# 2. Restaurar backup
./scripts/restore-database.sh

# 3. Rebuild e restart
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# 4. Verificar
./scripts/monitor.sh
```

---

## ✅ Checklist de Scripts

Para produção, configure:

- [ ] Todos os scripts com permissão de execução
- [ ] Backup automático diário configurado
- [ ] Monitoramento configurado (manual ou cron)
- [ ] Renovação SSL automática configurada
- [ ] Email de alertas configurado no monitor
- [ ] Limpeza periódica configurada
- [ ] Testado restauração de backup
- [ ] Documentado processo de deploy

---

## 📚 Recursos

- [Documentação Cron](https://man7.org/linux/man-pages/man5/crontab.5.html)
- [Bash Scripting Guide](https://tldp.org/LDP/abs/html/)
- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup.html)

---

## 💡 Dicas

1. ✅ Sempre teste scripts em ambiente de desenvolvimento primeiro
2. ✅ Mantenha logs dos scripts para auditoria
3. ✅ Use caminhos absolutos em scripts executados pelo cron
4. ✅ Configure alertas para falhas críticas
5. ✅ Documente qualquer customização
6. ✅ Faça backup antes de mudanças importantes
7. ✅ Teste restauração de backups regularmente

---

**🎯 Scripts mantidos e testados para produção!**

Para suporte, consulte a documentação completa em `/DOCS/`.

