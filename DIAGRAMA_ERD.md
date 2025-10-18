# 📊 Diagrama ERD - Marketplace Database

## Visão Geral do Banco de Dados

O banco de dados do Marketplace é composto por **3 tabelas principais** com relacionamentos bem definidos:

---

## 🗂️ Estrutura das Tabelas

### 1️⃣ **Tabela: `usuarios`**

Armazena informações dos usuários da plataforma.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| **id** | UUID | PRIMARY KEY | Identificador único do usuário |
| **email** | VARCHAR(255) | UNIQUE, NOT NULL | Email do usuário (login) |
| **senha_hash** | VARCHAR(255) | NOT NULL | Senha criptografada (bcrypt) |
| **nome** | VARCHAR(255) | NOT NULL | Nome completo do usuário |
| **telefone** | VARCHAR(20) | NULL | Telefone de contato |
| **foto_perfil_url** | VARCHAR(500) | NULL | URL da foto de perfil |
| **foto_perfil_data** | TEXT | NULL | Dados da foto em base64 |
| **data_criacao** | TIMESTAMP | DEFAULT NOW() | Data de criação da conta |
| **data_atualizacao** | TIMESTAMP | DEFAULT NOW() | Data da última atualização |

**Índices:**
- `idx_usuarios_email` - Índice único no email para busca rápida

**Relacionamentos:**
- 1 usuário → N produtos (1:N)
- 1 usuário → 1 configuração (1:1)

---

### 2️⃣ **Tabela: `produtos`**

Armazena os produtos cadastrados pelos usuários.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| **id** | UUID | PRIMARY KEY | Identificador único do produto |
| **titulo** | VARCHAR(255) | NOT NULL | Nome/título do produto |
| **descricao** | TEXT | NOT NULL | Descrição detalhada |
| **preco** | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Preço do produto |
| **categoria** | VARCHAR(100) | NOT NULL | Categoria do produto |
| **imagem_url** | VARCHAR(500) | NULL | URL da imagem principal |
| **imagens** | JSONB | NULL | Array de URLs de imagens adicionais |
| **status** | ENUM | NOT NULL, DEFAULT 'ativo' | Status: ativo, vendido, inativo |
| **usuario_id** | UUID | FOREIGN KEY, NOT NULL | ID do usuário proprietário |
| **data_criacao** | TIMESTAMP | DEFAULT NOW() | Data de criação do produto |
| **data_atualizacao** | TIMESTAMP | DEFAULT NOW() | Data da última atualização |

**ENUM Status:**
```sql
CREATE TYPE statusproduto AS ENUM ('ativo', 'vendido', 'inativo');
```

**Índices:**
- `idx_produtos_usuario_id` - Índice na chave estrangeira
- `idx_produtos_categoria` - Índice para filtros por categoria
- `idx_produtos_status` - Índice para filtros por status
- `idx_produtos_preco` - Índice para ordenação por preço

**Relacionamentos:**
- N produtos → 1 usuário (N:1)

---

### 3️⃣ **Tabela: `configuracoes_usuario`**

Armazena as configurações personalizadas de cada usuário.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| **id** | UUID | PRIMARY KEY | Identificador único da configuração |
| **usuario_id** | UUID | FOREIGN KEY, UNIQUE, NOT NULL | ID do usuário |
| **notificacoes_email** | BOOLEAN | DEFAULT TRUE | Receber notificações por email |
| **notificacoes_push** | BOOLEAN | DEFAULT TRUE | Receber notificações push |
| **tema** | VARCHAR(20) | DEFAULT 'claro' | Tema da interface (claro/escuro) |
| **idioma** | VARCHAR(10) | DEFAULT 'pt-BR' | Idioma preferido |
| **exibir_email** | BOOLEAN | DEFAULT FALSE | Exibir email no perfil público |
| **exibir_telefone** | BOOLEAN | DEFAULT FALSE | Exibir telefone no perfil público |
| **data_criacao** | TIMESTAMP | DEFAULT NOW() | Data de criação |
| **data_atualizacao** | TIMESTAMP | DEFAULT NOW() | Data da última atualização |

**Índices:**
- `idx_configuracoes_usuario_id` - Índice único na chave estrangeira

**Relacionamentos:**
- 1 configuração → 1 usuário (1:1)

---

## 🔗 Diagrama de Relacionamentos (ERD)

```
┌─────────────────────────────────────┐
│          USUARIOS                    │
├─────────────────────────────────────┤
│ 🔑 id (UUID, PK)                    │
│ 📧 email (VARCHAR, UNIQUE)          │
│ 🔒 senha_hash (VARCHAR)             │
│ 👤 nome (VARCHAR)                   │
│ 📱 telefone (VARCHAR)               │
│ 🖼️  foto_perfil_url (VARCHAR)       │
│ 📊 foto_perfil_data (TEXT)          │
│ 📅 data_criacao (TIMESTAMP)         │
│ 📅 data_atualizacao (TIMESTAMP)     │
└──────────┬──────────────────────────┘
           │
           │ 1
           │
           ├──────────────────────────┐
           │                          │
           │ N                        │ 1
           │                          │
           ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│      PRODUTOS            │  │  CONFIGURACOES_USUARIO       │
├──────────────────────────┤  ├──────────────────────────────┤
│ 🔑 id (UUID, PK)        │  │ 🔑 id (UUID, PK)            │
│ 📝 titulo (VARCHAR)     │  │ 🔗 usuario_id (UUID, FK)    │
│ 📄 descricao (TEXT)     │  │ 📧 notificacoes_email (BOOL)│
│ 💰 preco (DECIMAL)      │  │ 🔔 notificacoes_push (BOOL) │
│ 🏷️  categoria (VARCHAR) │  │ 🎨 tema (VARCHAR)           │
│ 🖼️  imagem_url (VARCHAR)│  │ 🌐 idioma (VARCHAR)         │
│ 📸 imagens (JSONB)      │  │ 👁️  exibir_email (BOOL)     │
│ 📊 status (ENUM)        │  │ 👁️  exibir_telefone (BOOL)  │
│ 🔗 usuario_id (UUID,FK) │  │ 📅 data_criacao (TIMESTAMP) │
│ 📅 data_criacao (TS)    │  │ 📅 data_atualizacao (TS)    │
│ 📅 data_atualizacao(TS) │  └──────────────────────────────┘
└──────────────────────────┘
```

---

## 🔐 Constraints e Regras de Negócio

### **Integridade Referencial**

1. **Produtos → Usuários**
   - `ON DELETE CASCADE` - Quando um usuário é excluído, todos os seus produtos são excluídos
   - `ON UPDATE CASCADE` - Atualização em cascata do ID do usuário

2. **Configurações → Usuários**
   - `ON DELETE CASCADE` - Quando um usuário é excluído, suas configurações são excluídas
   - `ON UPDATE CASCADE` - Atualização em cascata do ID do usuário

### **Validações**

1. **Usuários**
   - Email deve ser único
   - Email deve ter formato válido
   - Senha deve ter no mínimo 6 caracteres

2. **Produtos**
   - Preço deve ser maior que 0
   - Status deve ser um dos valores: 'ativo', 'vendido', 'inativo'
   - Título e descrição são obrigatórios

3. **Configurações**
   - Tema deve ser 'claro' ou 'escuro'
   - Idioma deve ser um dos suportados: 'pt-BR', 'en', 'es'

---

## 📋 Queries Comuns

### 1. **Buscar Produtos de um Usuário**
```sql
SELECT p.* 
FROM produtos p
WHERE p.usuario_id = :usuario_id
  AND p.status = 'ativo'
ORDER BY p.data_criacao DESC;
```

### 2. **Buscar Produtos por Categoria e Preço**
```sql
SELECT p.* 
FROM produtos p
WHERE p.categoria = :categoria
  AND p.preco BETWEEN :preco_min AND :preco_max
  AND p.status = 'ativo'
ORDER BY p.preco ASC;
```

### 3. **Obter Usuário com Configurações**
```sql
SELECT u.*, c.*
FROM usuarios u
LEFT JOIN configuracoes_usuario c ON c.usuario_id = u.id
WHERE u.id = :usuario_id;
```

### 4. **Contar Produtos por Status**
```sql
SELECT 
  status,
  COUNT(*) as total
FROM produtos
WHERE usuario_id = :usuario_id
GROUP BY status;
```

### 5. **Buscar Produtos Mais Recentes**
```sql
SELECT p.*, u.nome as vendedor_nome
FROM produtos p
JOIN usuarios u ON u.id = p.usuario_id
WHERE p.status = 'ativo'
ORDER BY p.data_criacao DESC
LIMIT 10;
```

---

## 🔄 Migrações (Alembic)

As migrações do banco de dados são gerenciadas pelo **Alembic**:

```bash
# Criar nova migração
alembic revision --autogenerate -m "descrição"

# Aplicar migrações
alembic upgrade head

# Reverter última migração
alembic downgrade -1
```

---

## 📊 Estatísticas e Performance

### **Índices Criados** (7 índices)
1. `idx_usuarios_email` - Busca rápida por email
2. `idx_produtos_usuario_id` - Join com usuários
3. `idx_produtos_categoria` - Filtro por categoria
4. `idx_produtos_status` - Filtro por status
5. `idx_produtos_preco` - Ordenação por preço
6. `idx_configuracoes_usuario_id` - Join com usuários

### **Tipos de Dados Otimizados**
- **UUID** para IDs - Mais seguro e distribuído
- **DECIMAL(10,2)** para preços - Precisão financeira
- **JSONB** para imagens múltiplas - Flexibilidade com indexação
- **ENUM** para status - Restrição de valores
- **TIMESTAMP** com timezone - Consistência temporal

---

## 🎯 Considerações de Escalabilidade

### **Implementado** ✅
- Índices em colunas frequentemente consultadas
- Tipos de dados apropriados
- Constraints de integridade
- Relacionamentos bem definidos

### **Futuras Melhorias** 🔮
- Particionamento de tabela `produtos` por data
- Cache de queries frequentes (Redis)
- Read replicas para separar leitura/escrita
- Arquivamento de produtos antigos
- Full-text search para busca de produtos

---

## 📝 Diagrama Visual (ASCII Art)

```
     ┌─────────────┐
     │  USUARIOS   │
     │   (Master)  │
     └──────┬──────┘
            │
            │ tem
            │
     ┌──────┴──────────────┐
     │                     │
     │                     │
     ▼                     ▼
┌─────────┐         ┌─────────────┐
│PRODUTOS │         │CONFIGURACOES│
│ (1:N)   │         │   (1:1)     │
└─────────┘         └─────────────┘

Legenda:
1:N = Um para Muitos (um usuário tem muitos produtos)
1:1 = Um para Um (um usuário tem uma configuração)
```

---

## 🔧 Scripts de Criação

### **Criação das Tabelas**

```sql
-- 1. Criar ENUM para status de produto
CREATE TYPE statusproduto AS ENUM ('ativo', 'vendido', 'inativo');

-- 2. Criar tabela de usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    foto_perfil_url VARCHAR(500),
    foto_perfil_data TEXT,
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- 3. Criar tabela de produtos
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
    categoria VARCHAR(100) NOT NULL,
    imagem_url VARCHAR(500),
    imagens JSONB,
    status statusproduto NOT NULL DEFAULT 'ativo',
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- 4. Criar tabela de configurações
CREATE TABLE configuracoes_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    notificacoes_email BOOLEAN DEFAULT TRUE,
    notificacoes_push BOOLEAN DEFAULT TRUE,
    tema VARCHAR(20) DEFAULT 'claro',
    idioma VARCHAR(10) DEFAULT 'pt-BR',
    exibir_email BOOLEAN DEFAULT FALSE,
    exibir_telefone BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- 5. Criar índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_produtos_usuario_id ON produtos(usuario_id);
CREATE INDEX idx_produtos_categoria ON produtos(categoria);
CREATE INDEX idx_produtos_status ON produtos(status);
CREATE INDEX idx_produtos_preco ON produtos(preco);
CREATE INDEX idx_configuracoes_usuario_id ON configuracoes_usuario(usuario_id);
```

---

## ✅ Validações Implementadas

### **Nível de Banco de Dados**
- ✅ Primary Keys (UUID)
- ✅ Foreign Keys com CASCADE
- ✅ UNIQUE constraints (email, usuario_id em configs)
- ✅ NOT NULL constraints
- ✅ CHECK constraints (preço > 0)
- ✅ DEFAULT values
- ✅ ENUM para status

### **Nível de Aplicação (Pydantic)**
- ✅ Validação de email
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Validação de preço (positivo)
- ✅ Validação de status (enum)
- ✅ Validação de URLs
- ✅ Sanitização de inputs

---

**📅 Última Atualização:** 17 de Outubro de 2025

**🎯 Status:** Implementado e Testado ✅
