#!/bin/bash

# ========================================
# Script de Monitoramento - Marketplace
# ========================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuração
COMPOSE_FILE="docker-compose.prod.yml"
ALERT_EMAIL=""  # Adicione seu email para alertas

# ========================================
# Funções de Check
# ========================================

check_container_health() {
    local container=$1
    local status=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null || echo "no-healthcheck")
    
    if [ "$status" == "healthy" ]; then
        echo -e "${GREEN}✅ $container: Healthy${NC}"
        return 0
    elif [ "$status" == "no-healthcheck" ]; then
        local running=$(docker inspect --format='{{.State.Running}}' $container 2>/dev/null || echo "false")
        if [ "$running" == "true" ]; then
            echo -e "${YELLOW}⚠️  $container: Running (no healthcheck)${NC}"
            return 0
        else
            echo -e "${RED}❌ $container: Not running${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $container: $status${NC}"
        return 1
    fi
}

check_disk_space() {
    local usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ $usage -lt 80 ]; then
        echo -e "${GREEN}✅ Disk space: ${usage}%${NC}"
        return 0
    elif [ $usage -lt 90 ]; then
        echo -e "${YELLOW}⚠️  Disk space: ${usage}%${NC}"
        return 0
    else
        echo -e "${RED}❌ Disk space: ${usage}% (CRITICAL)${NC}"
        return 1
    fi
}

check_memory() {
    local usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    
    if [ $usage -lt 80 ]; then
        echo -e "${GREEN}✅ Memory usage: ${usage}%${NC}"
        return 0
    elif [ $usage -lt 90 ]; then
        echo -e "${YELLOW}⚠️  Memory usage: ${usage}%${NC}"
        return 0
    else
        echo -e "${RED}❌ Memory usage: ${usage}% (HIGH)${NC}"
        return 1
    fi
}

check_docker_volumes() {
    local volume_usage=$(docker system df --format "{{.Type}}\t{{.Size}}\t{{.Reclaimable}}" | grep Volumes)
    echo -e "${GREEN}📦 Docker volumes: $volume_usage${NC}"
}

check_endpoint() {
    local url=$1
    local name=$2
    
    if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ $name: Accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ $name: Not accessible${NC}"
        return 1
    fi
}

check_database_connections() {
    local connections=$(docker compose -f $COMPOSE_FILE exec -T postgres psql -U marketplace_user -d marketplace_db -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname='marketplace_db';" 2>/dev/null | tr -d ' ')
    
    if [ -n "$connections" ]; then
        echo -e "${GREEN}✅ Database connections: ${connections}${NC}"
        
        if [ $connections -gt 50 ]; then
            echo -e "${YELLOW}⚠️  High number of database connections${NC}"
        fi
        return 0
    else
        echo -e "${RED}❌ Cannot check database connections${NC}"
        return 1
    fi
}

check_logs_size() {
    local log_dir="/var/lib/docker/containers"
    if [ -d "$log_dir" ]; then
        local log_size=$(sudo du -sh $log_dir 2>/dev/null | cut -f1)
        echo -e "${GREEN}📋 Docker logs size: ${log_size}${NC}"
    fi
}

# ========================================
# Função Principal de Monitoramento
# ========================================

monitor_system() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   Monitoramento - $(date)${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    local errors=0
    
    # Containers
    echo -e "${YELLOW}🐳 Verificando containers...${NC}"
    check_container_health "marketplace_backend_prod" || ((errors++))
    check_container_health "marketplace_frontend_prod" || ((errors++))
    check_container_health "marketplace_postgres_prod" || ((errors++))
    check_container_health "marketplace_nginx_prod" || ((errors++))
    check_container_health "marketplace_redis_prod" || ((errors++))
    echo ""
    
    # Sistema
    echo -e "${YELLOW}💻 Verificando recursos do sistema...${NC}"
    check_disk_space || ((errors++))
    check_memory || ((errors++))
    echo ""
    
    # Docker
    echo -e "${YELLOW}📦 Verificando Docker...${NC}"
    check_docker_volumes
    check_logs_size
    echo ""
    
    # Endpoints
    echo -e "${YELLOW}🌐 Verificando endpoints...${NC}"
    check_endpoint "http://localhost/docs" "Backend API" || ((errors++))
    check_endpoint "http://localhost/" "Frontend" || ((errors++))
    echo ""
    
    # Banco de dados
    echo -e "${YELLOW}🗄️  Verificando banco de dados...${NC}"
    check_database_connections || ((errors++))
    echo ""
    
    # Resumo
    echo -e "${GREEN}========================================${NC}"
    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}✅ Sistema saudável - Nenhum problema detectado${NC}"
    else
        echo -e "${RED}❌ $errors problema(s) detectado(s)${NC}"
        
        # Enviar alerta por email se configurado
        if [ -n "$ALERT_EMAIL" ]; then
            echo "Sistema com $errors problema(s) - $(date)" | mail -s "Alerta Marketplace" $ALERT_EMAIL
        fi
    fi
    echo -e "${GREEN}========================================${NC}"
    
    return $errors
}

# ========================================
# Execução
# ========================================

# Verificar se é modo contínuo
if [ "$1" == "--watch" ]; then
    echo "Modo de monitoramento contínuo (a cada 60s)"
    echo "Pressione Ctrl+C para sair"
    echo ""
    
    while true; do
        monitor_system
        sleep 60
        clear
    done
else
    monitor_system
fi

