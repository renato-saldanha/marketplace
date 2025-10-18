#!/bin/bash

# Script de inicialização do projeto Marketplace com Docker

echo "================================================"
echo "  MARKETPLACE - Inicialização Docker"
echo "================================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker não está instalado!${NC}"
        echo "Por favor, instale o Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
        echo "Por favor, instale o Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker e Docker Compose instalados${NC}"
}

# Função para parar containers existentes
stop_containers() {
    echo -e "${YELLOW}🛑 Parando containers existentes...${NC}"
    docker-compose down
}

# Função para construir as imagens
build_images() {
    echo -e "${YELLOW}🔨 Construindo imagens Docker...${NC}"
    docker-compose build --no-cache
}

# Função para iniciar os containers
start_containers() {
    echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
    docker-compose up -d
}

# Função para mostrar logs
show_logs() {
    echo -e "${GREEN}📋 Mostrando logs...${NC}"
    echo ""
    docker-compose logs -f
}

# Função para verificar status
check_status() {
    echo ""
    echo -e "${GREEN}✅ Containers em execução:${NC}"
    docker-compose ps
    echo ""
    echo -e "${GREEN}🌐 Serviços disponíveis:${NC}"
    echo "  • Frontend:  http://localhost:3000"
    echo "  • Backend:   http://localhost:8000"
    echo "  • API Docs:  http://localhost:8000/docs"
    echo "  • PostgreSQL: localhost:5432"
    echo ""
}

# Menu principal
main() {
    check_docker
    
    echo ""
    echo "Escolha uma opção:"
    echo "1) Iniciar containers (primeira vez - com build)"
    echo "2) Iniciar containers (rápido)"
    echo "3) Parar containers"
    echo "4) Reiniciar containers"
    echo "5) Ver logs"
    echo "6) Verificar status"
    echo "7) Limpar tudo (containers, volumes e imagens)"
    echo "0) Sair"
    echo ""
    read -p "Opção: " option
    
    case $option in
        1)
            stop_containers
            build_images
            start_containers
            sleep 5
            check_status
            echo -e "${YELLOW}Pressione Ctrl+C para sair dos logs${NC}"
            show_logs
            ;;
        2)
            start_containers
            sleep 5
            check_status
            echo -e "${YELLOW}Pressione Ctrl+C para sair dos logs${NC}"
            show_logs
            ;;
        3)
            stop_containers
            echo -e "${GREEN}✅ Containers parados${NC}"
            ;;
        4)
            stop_containers
            start_containers
            sleep 5
            check_status
            echo -e "${YELLOW}Pressione Ctrl+C para sair dos logs${NC}"
            show_logs
            ;;
        5)
            show_logs
            ;;
        6)
            check_status
            ;;
        7)
            echo -e "${RED}⚠️  Isso irá remover todos os containers, volumes e imagens!${NC}"
            read -p "Tem certeza? (s/N): " confirm
            if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
                docker-compose down -v --rmi all
                echo -e "${GREEN}✅ Tudo limpo!${NC}"
            else
                echo "Operação cancelada."
            fi
            ;;
        0)
            echo "Até logo!"
            exit 0
            ;;
        *)
            echo -e "${RED}Opção inválida!${NC}"
            ;;
    esac
}

# Executa o menu principal
main

