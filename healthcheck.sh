#!/bin/sh
# Healthcheck script para containers Docker

# Função para verificar backend
check_backend() {
    curl -f http://localhost:8000/health || exit 1
}

# Função para verificar frontend
check_frontend() {
    wget --quiet --tries=1 --spider http://localhost:3000 || exit 1
}

# Função para verificar PostgreSQL
check_postgres() {
    pg_isready -U marketplace_user -d marketplace_db || exit 1
}

# Executar baseado no argumento
case "$1" in
    backend)
        check_backend
        ;;
    frontend)
        check_frontend
        ;;
    postgres)
        check_postgres
        ;;
    *)
        echo "Uso: $0 {backend|frontend|postgres}"
        exit 1
        ;;
esac

