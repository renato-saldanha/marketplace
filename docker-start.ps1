# Script de inicialização do projeto Marketplace com Docker (PowerShell)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  MARKETPLACE - Inicialização Docker" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se Docker está instalado
function Check-Docker {
    $dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
    $dockerComposeInstalled = Get-Command docker-compose -ErrorAction SilentlyContinue
    
    if (-not $dockerInstalled) {
        Write-Host "❌ Docker não está instalado!" -ForegroundColor Red
        Write-Host "Por favor, instale o Docker: https://docs.docker.com/get-docker/"
        exit 1
    }
    
    if (-not $dockerComposeInstalled) {
        Write-Host "❌ Docker Compose não está instalado!" -ForegroundColor Red
        Write-Host "Por favor, instale o Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    }
    
    Write-Host "✅ Docker e Docker Compose instalados" -ForegroundColor Green
}

# Função para parar containers existentes
function Stop-Containers {
    Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
    docker-compose down
}

# Função para construir as imagens
function Build-Images {
    Write-Host "🔨 Construindo imagens Docker..." -ForegroundColor Yellow
    docker-compose build --no-cache
}

# Função para iniciar os containers
function Start-Containers {
    Write-Host "🚀 Iniciando containers..." -ForegroundColor Yellow
    docker-compose up -d
}

# Função para mostrar logs
function Show-Logs {
    Write-Host "📋 Mostrando logs..." -ForegroundColor Green
    Write-Host ""
    docker-compose logs -f
}

# Função para verificar status
function Check-Status {
    Write-Host ""
    Write-Host "✅ Containers em execução:" -ForegroundColor Green
    docker-compose ps
    Write-Host ""
    Write-Host "🌐 Serviços disponíveis:" -ForegroundColor Green
    Write-Host "  • Frontend:  http://localhost:3000"
    Write-Host "  • Backend:   http://localhost:8000"
    Write-Host "  • API Docs:  http://localhost:8000/docs"
    Write-Host "  • PostgreSQL: localhost:5432"
    Write-Host ""
}

# Menu principal
function Show-Menu {
    Check-Docker
    
    Write-Host ""
    Write-Host "Escolha uma opção:"
    Write-Host "1) Iniciar containers (primeira vez - com build)"
    Write-Host "2) Iniciar containers (rápido)"
    Write-Host "3) Parar containers"
    Write-Host "4) Reiniciar containers"
    Write-Host "5) Ver logs"
    Write-Host "6) Verificar status"
    Write-Host "7) Limpar tudo (containers, volumes e imagens)"
    Write-Host "0) Sair"
    Write-Host ""
    
    $option = Read-Host "Opção"
    
    switch ($option) {
        1 {
            Stop-Containers
            Build-Images
            Start-Containers
            Start-Sleep -Seconds 5
            Check-Status
            Write-Host "Pressione Ctrl+C para sair dos logs" -ForegroundColor Yellow
            Show-Logs
        }
        2 {
            Start-Containers
            Start-Sleep -Seconds 5
            Check-Status
            Write-Host "Pressione Ctrl+C para sair dos logs" -ForegroundColor Yellow
            Show-Logs
        }
        3 {
            Stop-Containers
            Write-Host "✅ Containers parados" -ForegroundColor Green
        }
        4 {
            Stop-Containers
            Start-Containers
            Start-Sleep -Seconds 5
            Check-Status
            Write-Host "Pressione Ctrl+C para sair dos logs" -ForegroundColor Yellow
            Show-Logs
        }
        5 {
            Show-Logs
        }
        6 {
            Check-Status
        }
        7 {
            Write-Host "⚠️  Isso irá remover todos os containers, volumes e imagens!" -ForegroundColor Red
            $confirm = Read-Host "Tem certeza? (s/N)"
            if ($confirm -eq "s" -or $confirm -eq "S") {
                docker-compose down -v --rmi all
                Write-Host "✅ Tudo limpo!" -ForegroundColor Green
            } else {
                Write-Host "Operação cancelada."
            }
        }
        0 {
            Write-Host "Até logo!"
            exit 0
        }
        default {
            Write-Host "Opção inválida!" -ForegroundColor Red
        }
    }
}

# Executa o menu principal
Show-Menu

