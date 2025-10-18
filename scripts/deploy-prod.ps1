# ========================================
# Script de Deploy para Produção (Windows)
# ========================================

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Green
Write-Host "   Deploy Marketplace - Produção" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar se está na branch correta
$branch = git branch --show-current
if ($branch -ne "main" -and $branch -ne "master") {
    Write-Host "⚠️  Aviso: Você não está na branch main/master" -ForegroundColor Yellow
    $continue = Read-Host "Deseja continuar? (s/N)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 1
    }
}

# Verificar se há mudanças não commitadas
$status = git status -s
if ($status) {
    Write-Host "⚠️  Há mudanças não commitadas" -ForegroundColor Yellow
    git status -s
    $continue = Read-Host "Deseja continuar? (s/N)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 1
    }
}

# Verificar se .env.production existe
if (-Not (Test-Path .env.production)) {
    Write-Host "❌ Erro: Arquivo .env.production não encontrado!" -ForegroundColor Red
    Write-Host "   Copie .env.production.example para .env.production e configure" -ForegroundColor Yellow
    exit 1
}

# Fazer backup do banco de dados antes do deploy
Write-Host "📦 Fazendo backup do banco de dados..." -ForegroundColor Green
$backupFile = "backup_pre_deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U marketplace_user marketplace_db > $backupFile 2>$null

# Parar containers antigos
Write-Host "🛑 Parando containers antigos..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml down

# Fazer pull das últimas mudanças
Write-Host "📥 Atualizando código..." -ForegroundColor Green
git pull origin $branch

# Construir novas imagens
Write-Host "🏗️  Construindo novas imagens..." -ForegroundColor Green
$BUILD_DATE = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$VERSION = git describe --tags --always
$env:BUILD_DATE = $BUILD_DATE
$env:VERSION = $VERSION

docker-compose -f docker-compose.prod.yml build --no-cache --build-arg BUILD_DATE=$BUILD_DATE --build-arg VERSION=$VERSION

# Iniciar containers
Write-Host "🚀 Iniciando containers..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml up -d

# Aguardar containers iniciarem
Write-Host "⏳ Aguardando containers iniciarem..." -ForegroundColor Green
Start-Sleep -Seconds 15

# Verificar saúde dos containers
Write-Host "🏥 Verificando saúde dos containers..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml ps

# Executar migrações do banco
Write-Host "🔄 Executando migrações do banco..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml exec -T backend alembic upgrade head

# Verificar logs
Write-Host "📋 Verificando logs..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml logs --tail=50

# Teste de conectividade
Write-Host ""
Write-Host "🧪 Testando conectividade..." -ForegroundColor Green
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://localhost/docs" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend está respondendo!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend não está respondendo!" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend está respondendo!" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend não está respondendo!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Deploy Concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Comandos úteis:" -ForegroundColor Yellow
Write-Host "  Ver logs:      docker-compose -f docker-compose.prod.yml logs -f"
Write-Host "  Ver status:    docker-compose -f docker-compose.prod.yml ps"
Write-Host "  Parar:         docker-compose -f docker-compose.prod.yml down"
Write-Host "  Restart:       docker-compose -f docker-compose.prod.yml restart"
Write-Host ""

