# 🛒 Marketplace - Plataforma de Vendas Online

Uma plataforma completa de marketplace desenvolvida com **Next.js 15**, **FastAPI** e **PostgreSQL**, oferecendo uma experiência moderna e responsiva para vendedores e compradores.

---

## 📑 Índice

- [✨ Funcionalidades](#-funcionalidades-implementadas)
- [🛠️ Tecnologias e Dependências](#️-tecnologias-e-dependências)
- [🚀 Como Executar](#-como-executar-o-projeto)
  - [🐳 Com Docker (Recomendado)](#-opção-1-executar-com-docker-mais-fácil)
  - [💻 Instalação Manual](#-opção-2-instalação-manual)
- [📊 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔌 API - Endpoints](#-api---endpoints-disponíveis)
  - [🔐 Autenticação](#-autenticação)
  - [📦 Produtos](#-produtos)
  - [⚙️ Configurações](#️-configurações)
  - [📊 Dashboard / Analytics](#-dashboard--analytics)
- [🧪 Testes](#-executando-testes)
- [🔧 Scripts](#-scripts-disponíveis)
- [🚀 Deploy](#-deploy)

---

## ⚡ Início Rápido

### 🐳 Forma Mais Fácil (Docker)

```bash
# Clone o repositório
git clone <repository-url>
cd marketplace

# Inicie com Docker (Windows)
.\docker-start.ps1

# OU diretamente
docker-compose up --build -d
```

**Acesse:** http://localhost:3000  
**Login:** vendedor@teste.com / senha123

📚 **Não tem Docker?** Veja [Instalação Docker](INSTALACAO_DOCKER.md)

### 💻 Instalação Manual Rápida

```bash
# Backend
cd backend
pip install -r requirements.txt
python init_db.py
python criar_dados_teste.py
python run.py  # http://localhost:8000

# Frontend (em outro terminal)
cd ..
npm install
npm run dev  # http://localhost:3000
```

⚠️ **Requer:** PostgreSQL rodando em localhost:5432

---

## ✨ Funcionalidades Implementadas

### 🎯 **Dashboard Completo**
- ✅ **Cards de Métricas**: Produtos ativos, vendidos, total de vendas, visitantes
- ✅ **Gráfico de Vendas**: Visualização interativa com Recharts
- ✅ **Produtos em Destaque**: Seção com produtos mais populares
- ✅ **Seletor de Período**: Filtros por data (7 dias, 30 dias, etc.)
- ✅ **Métricas em Tempo Real**: KPIs atualizados dinamicamente

### 🔐 **Sistema de Autenticação**
- ✅ **Registro de Usuários**: Cadastro completo com validação
- ✅ **Login Seguro**: Autenticação JWT com tokens
- ✅ **Perfil do Usuário**: Gerenciamento de dados pessoais
- ✅ **Alteração de Senha**: Sistema seguro de mudança de senha
- ✅ **Logout**: Encerramento seguro de sessão

### 📦 **Gestão de Produtos**
- ✅ **CRUD Completo**: Criar, listar, editar e excluir produtos
- ✅ **Upload de Imagens**: Sistema de upload com múltiplos tamanhos
- ✅ **Categorias**: Organização por categorias
- ✅ **Status de Produtos**: Ativo, vendido, inativo
- ✅ **Busca Avançada**: Filtros por categoria, preço, status
- ✅ **Paginação Inteligente**: Navegação otimizada com cache

### ⚙️ **Configurações do Usuário**
- ✅ **Configurações de Notificação**: Email e push notifications
- ✅ **Temas**: Modo claro e escuro
- ✅ **Idiomas**: Suporte a múltiplos idiomas
- ✅ **Privacidade**: Controle de visibilidade do perfil
- ✅ **Exportação de Dados**: Download de dados pessoais
- ✅ **Exclusão de Conta**: Remoção completa de dados

### 🚀 **Otimizações de Performance**
- ✅ **Lazy Loading**: Carregamento sob demanda de componentes
- ✅ **Code Splitting**: Divisão inteligente do código
- ✅ **Cache de Produtos**: Sistema de cache client-side
- ✅ **Otimização de Imagens**: Next.js Image com otimização automática
- ✅ **Bundle Optimization**: Remoção de console.log em produção

### 🧪 **Sistema de Testes**
- ✅ **Testes Unitários Frontend**: Jest + React Testing Library
- ✅ **Testes de Integração Backend**: Pytest + FastAPI TestClient
- ✅ **Cobertura de Código**: Thresholds configurados
- ✅ **Testes de Componentes**: Validação de UI components

### 📱 **PWA (Progressive Web App)**
- ✅ **Service Worker**: Funcionamento offline
- ✅ **Manifest**: Instalação como app nativo
- ✅ **Responsive Design**: Adaptação a todos os dispositivos
- ✅ **Push Notifications**: Notificações nativas

## 🛠️ **Tecnologias e Dependências**

### **Frontend**

#### Dependências Principais
```json
{
  "next": "15.5.5",                    // Framework React
  "react": "19.1.0",                   // Biblioteca UI
  "react-dom": "19.1.0",               // React DOM
  "typescript": "^5",                  // TypeScript
  "axios": "^1.12.2",                  // Cliente HTTP
  "recharts": "^3.2.1",                // Gráficos
  "lucide-react": "^0.545.0",          // Ícones
  "clsx": "^2.1.1",                    // Classes CSS
  "tailwind-merge": "^3.3.1",          // Merge Tailwind
  "uuid": "^13.0.0"                    // IDs únicos
}
```

#### Dependências de Desenvolvimento
```json
{
  "tailwindcss": "^3.4.18",            // CSS Framework
  "postcss": "^8.5.6",                 // CSS Processor
  "autoprefixer": "^10.4.21",          // CSS Prefixer
  "eslint": "^9",                      // Linter
  "jest": "^29.7.0",                   // Testes
  "@testing-library/react": "^14.1.2", // Testes React
  "@testing-library/jest-dom": "^6.1.5" // Matchers Jest
}
```

### **Backend**

#### Dependências Python
```txt
# Framework e Servidor
fastapi==0.104.1                 # Framework web
uvicorn[standard]==0.24.0        # Servidor ASGI

# Banco de Dados
sqlalchemy==2.0.23               # ORM
alembic==1.12.1                  # Migrações
psycopg2-binary==2.9.9           # Driver PostgreSQL

# Autenticação e Segurança
python-jose[cryptography]==3.3.0 # JWT tokens
passlib[bcrypt]==1.7.4           # Hash de senhas
python-multipart==0.0.6          # Form data

# Validação
pydantic==2.5.0                  # Validação de dados
pydantic-settings==2.1.0         # Configurações

# Utilitários
pillow>=10.0.0                   # Processamento de imagens
python-dotenv==1.0.0             # Variáveis de ambiente
fastapi-cors==0.0.6              # CORS
```

### **Banco de Dados**
- **PostgreSQL 16** - Banco de dados relacional
- **Alembic** - Sistema de migrações
- **SQLAlchemy 2.0** - ORM moderno

### **Infraestrutura**
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Git** - Controle de versão
- **WSL 2** - Subsistema Linux (Windows)

### **Ferramentas de Desenvolvimento**
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatação de código
- **Jest** - Testes unitários frontend
- **Pytest** - Testes unitários backend
- **React Testing Library** - Testes de componentes

## 🚀 **Como Executar o Projeto**

### **📋 Pré-requisitos**

#### Opção 1: Com Docker (Recomendado) 🐳
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/) 2.0+

#### Opção 2: Instalação Manual
- [Node.js](https://nodejs.org/) 18+ 
- [Python](https://www.python.org/) 3.11+
- [PostgreSQL](https://www.postgresql.org/) 14+
- [Git](https://git-scm.com/)

---

## 🐳 **Opção 1: Executar com Docker (Mais Fácil)**

### **1. Clone o Repositório**
```bash
git clone <repository-url>
cd marketplace
```

### **2. Executar com Script Interativo**

**Windows (PowerShell):**
```powershell
.\docker-start.ps1
```

**Linux/Mac:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

Escolha a **Opção 1** no menu (primeira vez - com build).

### **3. OU Executar Diretamente**
```bash
# Construir e iniciar todos os containers
docker-compose up --build -d

# Ver logs em tempo real
docker-compose logs -f

# Parar containers
docker-compose down
```

### **4. Acessar a Aplicação**
- 🎨 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000
- 📖 **Swagger Docs**: http://localhost:8000/docs
- 📘 **ReDoc**: http://localhost:8000/redoc
- 🗄️ **PostgreSQL**: localhost:5432

### **5. Credenciais de Teste**
```
Email: vendedor@teste.com
Senha: senha123
```

**✨ Pronto! O ambiente está configurado com:**
- ✅ PostgreSQL rodando
- ✅ Banco de dados criado
- ✅ Tabelas inicializadas
- ✅ Dados de teste inseridos
- ✅ Backend rodando (porta 8000)
- ✅ Frontend rodando (porta 3000)
- ✅ Hot reload habilitado

📚 **Documentação Docker Completa**: Veja `DOCKER_README.md`

---

## 💻 **Opção 2: Instalação Manual**

### **1. Clone o Repositório**
```bash
git clone <repository-url>
cd marketplace
```

### **2. Configuração do PostgreSQL**
```bash
# Criar banco de dados
psql -U postgres
CREATE DATABASE marketplace_db;
CREATE USER marketplace_user WITH PASSWORD 'marketplace_pass';
GRANT ALL PRIVILEGES ON DATABASE marketplace_db TO marketplace_user;
\q
```

### **3. Configuração do Backend**
```bash
cd backend

# Criar ambiente virtual (recomendado)
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
# Criar arquivo .env com:
DATABASE_URL=postgresql://marketplace_user:marketplace_pass@localhost:5432/marketplace_db
SECRET_KEY=sua-chave-secreta-super-segura-aqui-mude-em-producao
DEBUG=true

# Inicializar banco de dados
python init_db.py

# Criar dados de teste (opcional)
python criar_dados_teste.py

# Iniciar servidor
python run.py
```

O backend estará rodando em: http://localhost:8000

### **4. Configuração do Frontend**
```bash
# Em outro terminal, volte para a raiz do projeto
cd ..

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Criar arquivo .env.local com:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Iniciar aplicação
npm run dev
```

O frontend estará rodando em: http://localhost:3000

### **5. Acessar a Aplicação**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### **6. Credenciais de Teste**
```
Email: vendedor@teste.com
Senha: senha123
```

## 📊 **Estrutura do Projeto**

```
marketplace/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/            # Rotas da API
│   │   │   ├── auth.py     # Autenticação (login, registro)
│   │   │   ├── produtos.py # Gestão de produtos
│   │   │   ├── configuracao.py # Configurações usuário
│   │   │   └── deps.py     # Dependências compartilhadas
│   │   ├── core/           # Configurações e segurança
│   │   │   ├── config.py   # Configurações da app
│   │   │   └── seguranca.py # JWT e segurança
│   │   ├── database/       # Configuração do banco
│   │   │   └── database.py # Setup SQLAlchemy
│   │   ├── models/         # Modelos SQLAlchemy
│   │   │   ├── usuario.py  # Modelo de usuário
│   │   │   ├── produto.py  # Modelo de produto
│   │   │   └── configuracao.py # Modelo configurações
│   │   ├── schemas/        # Schemas Pydantic
│   │   │   ├── usuario.py  # Schemas de usuário
│   │   │   ├── produto.py  # Schemas de produto
│   │   │   └── configuracao.py # Schemas config
│   │   ├── services/       # Lógica de negócio
│   │   │   ├── usuario_service.py
│   │   │   ├── produto_service.py
│   │   │   ├── upload_service.py
│   │   │   └── configuracao_service.py
│   │   └── main.py        # Entrada da aplicação
│   ├── tests/              # Testes de integração
│   │   ├── test_auth.py
│   │   ├── test_produtos.py
│   │   └── test_configuracao.py
│   ├── uploads/            # Arquivos enviados
│   │   ├── produtos/       # Imagens de produtos
│   │   └── perfis/         # Fotos de perfil
│   ├── requirements.txt    # Dependências Python
│   ├── Dockerfile          # Container backend
│   ├── init_db.py          # Inicializar banco
│   └── run.py              # Script de execução
├── src/                    # Frontend Next.js
│   ├── app/               # Páginas (App Router)
│   │   ├── page.tsx       # Dashboard principal
│   │   ├── login/         # Página de login
│   │   ├── registrar/     # Página de registro
│   │   ├── produtos/      # Gestão de produtos
│   │   ├── profile/       # Perfil do usuário
│   │   └── configuracao/  # Configurações
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes UI base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── CardProduto.tsx
│   │   │   └── ...
│   │   ├── DashboardLayout.tsx
│   │   ├── ProdutosTab.tsx
│   │   └── ...
│   ├── lib/              # Utilitários e hooks
│   │   ├── api.ts        # Cliente API
│   │   ├── hooks/        # Custom hooks
│   │   ├── servicos/     # Serviços
│   │   └── utils.ts      # Funções utilitárias
│   └── types/            # Tipos TypeScript
│       └── index.ts      # Definições de tipos
├── public/               # Arquivos estáticos
│   ├── icons/           # Ícones PWA
│   ├── manifest.json    # Manifest PWA
│   └── sw.js           # Service Worker
├── docker-compose.yml   # Orquestração Docker
├── Dockerfile          # Container frontend (prod)
├── Dockerfile.dev      # Container frontend (dev)
└── docs/              # Documentação
    ├── DOCKER_README.md
    ├── COMANDOS_DOCKER.md
    └── ...
```

---

## 🔌 **API - Endpoints Disponíveis**

### 📍 **Base URL**: `http://localhost:8000`

### 🔐 **Autenticação**

#### **POST** `/auth/registrar`
Registrar novo usuário

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senhaSegura123"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@example.com",
  "criado_em": "2024-01-15T10:30:00",
  "atualizado_em": "2024-01-15T10:30:00"
}
```

---

#### **POST** `/auth/login`
Fazer login e obter token JWT

**Request Body:**
```json
{
  "email": "joao@example.com",
  "senha": "senhaSegura123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "usuario": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@example.com"
  }
}
```

---

#### **GET** `/auth/me`
Obter dados do usuário autenticado

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@example.com",
  "foto_perfil": "url_da_foto",
  "criado_em": "2024-01-15T10:30:00"
}
```

---

#### **PUT** `/auth/perfil`
Atualizar perfil do usuário

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "nome": "João Silva Santos",
  "email": "joao.novo@example.com"
}
```

**Response:** `200 OK`

---

#### **PUT** `/auth/senha`
Alterar senha do usuário

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "senha_atual": "senhaAntiga123",
  "senha_nova": "senhaNova456"
}
```

**Response:** `200 OK`
```json
{
  "mensagem": "Senha alterada com sucesso"
}
```

---

### 📦 **Produtos**

#### **GET** `/produtos`
Listar produtos do usuário com paginação

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip` (int, optional): Número de itens para pular (default: 0)
- `limit` (int, optional): Número de itens por página (default: 10, max: 100)
- `categoria` (string, optional): Filtrar por categoria
- `status` (string, optional): Filtrar por status (ativo, vendido, inativo)
- `busca` (string, optional): Buscar por nome ou descrição

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "nome": "iPhone 13",
      "descricao": "128GB Azul",
      "preco": 3999.00,
      "categoria": "Eletrônicos",
      "status": "ativo",
      "fotos": [
        "http://localhost:8000/uploads/produtos/uuid/foto_0.jpg"
      ],
      "criado_em": "2024-01-15T10:30:00",
      "atualizado_em": "2024-01-15T10:30:00"
    }
  ],
  "total": 45,
  "skip": 0,
  "limit": 10
}
```

---

#### **GET** `/produtos/{id}`
Obter detalhes de um produto específico

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "nome": "iPhone 13",
  "descricao": "128GB Azul, seminovo, com caixa",
  "preco": 3999.00,
  "categoria": "Eletrônicos",
  "status": "ativo",
  "fotos": [
    "http://localhost:8000/uploads/produtos/uuid/foto_0.jpg",
    "http://localhost:8000/uploads/produtos/uuid/foto_1.jpg"
  ],
  "vendedor_id": "uuid",
  "criado_em": "2024-01-15T10:30:00",
  "atualizado_em": "2024-01-15T10:30:00"
}
```

---

#### **POST** `/produtos`
Criar novo produto

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "nome": "MacBook Pro",
  "descricao": "M1 Pro 16GB RAM 512GB SSD",
  "preco": 8999.99,
  "categoria": "Eletrônicos",
  "status": "ativo"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "nome": "MacBook Pro",
  "descricao": "M1 Pro 16GB RAM 512GB SSD",
  "preco": 8999.99,
  "categoria": "Eletrônicos",
  "status": "ativo",
  "fotos": [],
  "vendedor_id": "uuid",
  "criado_em": "2024-01-15T10:30:00"
}
```

---

#### **PUT** `/produtos/{id}`
Atualizar produto existente

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "nome": "MacBook Pro M2",
  "preco": 9999.99,
  "status": "ativo"
}
```

**Response:** `200 OK`

---

#### **DELETE** `/produtos/{id}`
Excluir produto

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

---

#### **POST** `/produtos/{id}/fotos`
Upload de fotos do produto (até 5 fotos)

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
files: [File, File, File]  // Array de arquivos
```

**Formatos aceitos:** JPG, PNG, GIF, WEBP  
**Tamanho máximo:** 5MB por arquivo

**Response:** `200 OK`
```json
{
  "mensagem": "Fotos enviadas com sucesso",
  "urls": [
    "http://localhost:8000/uploads/produtos/uuid/foto_0.jpg",
    "http://localhost:8000/uploads/produtos/uuid/foto_1.jpg"
  ]
}
```

---

### ⚙️ **Configurações**

#### **GET** `/configuracao`
Obter configurações do usuário

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "usuario_id": "uuid",
  "notificacoes_email": true,
  "notificacoes_push": true,
  "tema": "claro",
  "idioma": "pt-BR",
  "moeda": "BRL",
  "visibilidade_perfil": "publico",
  "criado_em": "2024-01-15T10:30:00",
  "atualizado_em": "2024-01-15T10:30:00"
}
```

---

#### **PUT** `/configuracao`
Atualizar configurações do usuário

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "notificacoes_email": false,
  "notificacoes_push": true,
  "tema": "escuro",
  "idioma": "pt-BR",
  "moeda": "BRL",
  "visibilidade_perfil": "privado"
}
```

**Response:** `200 OK`

---

### 📊 **Dashboard / Analytics**

#### **GET** `/produtos/estatisticas`
Obter estatísticas dos produtos

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `periodo` (string, optional): 7d, 30d, 90d, 1y (default: 30d)

**Response:** `200 OK`
```json
{
  "total_produtos": 45,
  "produtos_ativos": 32,
  "produtos_vendidos": 13,
  "total_vendas": 45678.90,
  "visitantes": 1234,
  "conversao": 2.5,
  "produtos_destaque": [
    {
      "id": "uuid",
      "nome": "iPhone 13",
      "preco": 3999.00,
      "visualizacoes": 234
    }
  ],
  "vendas_por_dia": [
    {
      "data": "2024-01-15",
      "total": 5,
      "valor": 12000.00
    }
  ]
}
```

---

### 🔒 **Autenticação de Endpoints**

Todos os endpoints (exceto `/auth/login` e `/auth/registrar`) requerem autenticação JWT.

**Como usar:**
1. Faça login em `/auth/login`
2. Copie o `access_token` da resposta
3. Inclua no header de todas as requisições:
   ```
   Authorization: Bearer {access_token}
   ```

**Exemplo com cURL:**
```bash
curl -X GET "http://localhost:8000/produtos" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json"
```

**Exemplo com JavaScript (Axios):**
```javascript
axios.get('http://localhost:8000/produtos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

### 📖 **Documentação Interativa**

A API possui documentação interativa onde você pode testar todos os endpoints:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

**Recursos:**
- ✅ Testar endpoints diretamente no navegador
- ✅ Ver schemas de request/response
- ✅ Autenticar e salvar token
- ✅ Exemplos de uso
- ✅ Códigos de resposta HTTP

---

### ⚠️ **Códigos de Resposta HTTP**

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Requisição bem-sucedida sem conteúdo |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token inválido ou ausente |
| 403 | Forbidden | Sem permissão para o recurso |
| 404 | Not Found | Recurso não encontrado |
| 422 | Unprocessable Entity | Validação de dados falhou |
| 500 | Internal Server Error | Erro no servidor |

---

### 🔄 **Rate Limiting**

Atualmente não há limite de requisições configurado em desenvolvimento.  
Em produção, recomenda-se configurar rate limiting.

---

### 📝 **Exemplos de Uso Completos**

#### Fluxo de Cadastro e Criação de Produto

```javascript
// 1. Registrar usuário
const registro = await axios.post('http://localhost:8000/auth/registrar', {
  nome: 'João Silva',
  email: 'joao@example.com',
  senha: 'senhaSegura123'
});

// 2. Fazer login
const login = await axios.post('http://localhost:8000/auth/login', {
  email: 'joao@example.com',
  senha: 'senhaSegura123'
});

const token = login.data.access_token;

// 3. Criar produto
const produto = await axios.post('http://localhost:8000/produtos', {
  nome: 'iPhone 13',
  descricao: '128GB Azul',
  preco: 3999.00,
  categoria: 'Eletrônicos',
  status: 'ativo'
}, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 4. Upload de fotos
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);

await axios.post(
  `http://localhost:8000/produtos/${produto.data.id}/fotos`,
  formData,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
);

// 5. Listar produtos
const produtos = await axios.get('http://localhost:8000/produtos', {
  headers: { 'Authorization': `Bearer ${token}` },
  params: { categoria: 'Eletrônicos', limit: 20 }
});
```

## 🧪 **Executando Testes**

### **Frontend**
```bash
npm test                    # Executar todos os testes
npm run test:watch         # Modo watch
npm run test:coverage      # Com cobertura
```

### **Backend**
```bash
cd backend
pytest                     # Executar todos os testes
pytest -v                  # Modo verbose
pytest --cov              # Com cobertura
```

## 📈 **Métricas de Qualidade**

- ✅ **Cobertura de Testes**: >70% (configurado)
- ✅ **Linting**: ESLint + Prettier
- ✅ **Type Safety**: TypeScript strict mode
- ✅ **Performance**: Bundle size otimizado
- ✅ **Acessibilidade**: Componentes acessíveis
- ✅ **SEO**: Meta tags e estrutura otimizada

## 🔧 **Scripts Disponíveis**

### **Frontend**
```bash
npm run dev              # Inicia servidor de desenvolvimento (http://localhost:3000)
npm run build            # Build de produção otimizado
npm run start            # Inicia servidor de produção
npm run lint             # Executa linting (ESLint)
npm run test             # Executa todos os testes (Jest)
npm run test:watch       # Testes em modo watch
npm run test:coverage    # Testes com relatório de cobertura
```

### **Backend**
```bash
python run.py            # Inicia servidor (http://localhost:8000)
uvicorn app.main:app     # Inicia com uvicorn diretamente
pytest                   # Executa todos os testes
pytest -v                # Testes em modo verbose
pytest --cov             # Testes com cobertura
python init_db.py        # Inicializa banco de dados
python criar_dados_teste.py  # Cria dados de teste
alembic upgrade head     # Aplica migrações do banco
alembic revision -m "msg"  # Cria nova migração
```

### **Docker**
```bash
docker-compose up -d            # Inicia todos os containers
docker-compose up --build -d    # Rebuild e inicia
docker-compose down             # Para todos os containers
docker-compose logs -f          # Ver logs em tempo real
docker-compose ps               # Ver status dos containers
docker-compose restart backend  # Reinicia um serviço
.\docker-start.ps1              # Menu interativo (Windows)
./docker-start.sh               # Menu interativo (Linux/Mac)
```

### **Utilitários**
```bash
# Ver processos nas portas
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Linux/Mac

# Limpar dependências
rm -rf node_modules package-lock.json && npm install
pip uninstall -r requirements.txt -y && pip install -r requirements.txt
```

## 🌟 **Funcionalidades Avançadas**

### **Sistema de Cache**
- Cache inteligente de produtos
- Invalidação automática
- Otimização de performance

### **Upload de Imagens**
- Múltiplos tamanhos (thumb, medium, original)
- Otimização automática
- Fallback para imagens padrão

### **Dashboard Analytics**
- Métricas em tempo real
- Gráficos interativos
- Filtros por período
- Produtos em destaque

### **Sistema de Notificações**
- Toast notifications
- Feedback visual
- Estados de loading
- Tratamento de erros

## 📱 **Responsividade**

- ✅ **Mobile First**: Design otimizado para mobile
- ✅ **Tablet**: Adaptação para tablets
- ✅ **Desktop**: Interface completa para desktop
- ✅ **Touch Friendly**: Elementos otimizados para touch

## 🔒 **Segurança**

- ✅ **JWT Authentication**: Tokens seguros
- ✅ **Password Hashing**: Senhas criptografadas
- ✅ **CORS**: Configuração adequada
- ✅ **Input Validation**: Validação de dados
- ✅ **SQL Injection Protection**: ORM seguro

## 🚀 **Deploy**

### **Frontend (Vercel)**
```bash
npm run build
# Deploy automático via Vercel
```

### **Backend (Docker)**
```bash
docker build -t marketplace-backend .
docker run -p 8000:8000 marketplace-backend
```

## 📝 **Próximas Funcionalidades**

- [ ] **Testes E2E**: Cypress para testes end-to-end
- [ ] **Relatórios Avançados**: Analytics detalhados
- [ ] **Sistema de Mensagens**: Chat entre usuários
- [ ] **Pagamentos**: Integração com gateways
- [ ] **Cache Redis**: Sistema de cache distribuído
- [ ] **Métricas de Performance**: APM e monitoring

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 **Equipe**

- **Desenvolvedor Full Stack**: Implementação completa do sistema
- **UI/UX Designer**: Design responsivo e moderno
- **DevOps**: Configuração de infraestrutura

## 📞 **Suporte**

Para suporte, entre em contato através de:
- **Email**: suporte@marketplace.com
- **Issues**: GitHub Issues
- **Documentação**: `/docs` na aplicação

---

**🎉 Marketplace - Transformando a forma de vender online!**