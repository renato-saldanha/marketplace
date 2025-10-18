# 🔧 Variáveis de Ambiente

## Frontend (Next.js)

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# URL do servidor backend (sem /api)
NEXT_PUBLIC_SERVER_URL=http://localhost:8000

# URL da API (com /api) - OPCIONAL
# Se não fornecido, será gerado automaticamente como ${NEXT_PUBLIC_SERVER_URL}/api
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### **Desenvolvimento**
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
```

### **Produção**
```env
NEXT_PUBLIC_SERVER_URL=https://api.seudominio.com
```

---

## Backend (FastAPI)

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
# Banco de dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/marketplace

# JWT
SECRET_KEY=sua-chave-secreta-super-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 dias

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Aplicação
APP_NAME=Marketplace API
APP_VERSION=1.0.0
```

### **Desenvolvimento**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/marketplace_dev
SECRET_KEY=dev-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:3000
```

### **Produção**
```env
DATABASE_URL=postgresql://usuario:senha@db.host:5432/marketplace_prod
SECRET_KEY=use-um-token-gerado-aleatoriamente-aqui
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
```

---

## 📝 Notas Importantes

1. **Nunca commite arquivos `.env`** - Eles estão no `.gitignore`
2. **`NEXT_PUBLIC_*`** são variáveis expostas ao browser
3. **SECRET_KEY** deve ser diferente em produção
4. **ALLOWED_ORIGINS** deve listar apenas domínios confiáveis

---

## 🔐 Gerar SECRET_KEY

### Python
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Bash
```bash
openssl rand -base64 32
```

### PowerShell
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

