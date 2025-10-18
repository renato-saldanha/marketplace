# 🚀 GUIA RÁPIDO - Marketplace Frontend

## 📋 **ÍNDICE**
1. [Como Iniciar](#como-iniciar)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Componentes Principais](#componentes-principais)
4. [Hooks Customizados](#hooks-customizados)
5. [Sistema de Validação](#sistema-de-validação)
6. [Sistema de Cache](#sistema-de-cache)
7. [Exemplos de Uso](#exemplos-de-uso)

---

## 🏁 **COMO INICIAR**

### **1. Instalar Dependências**
```bash
npm install
```

### **2. Configurar Variáveis de Ambiente**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### **3. Iniciar Servidor de Desenvolvimento**
```bash
npm run dev
```

### **4. Abrir no Navegador**
```
http://localhost:3000
```

---

## 📁 **ESTRUTURA DO PROJETO**

```
src/
├── app/                    # Páginas (Next.js App Router)
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Dashboard
│   ├── login/              # Login
│   ├── register/           # Registro
│   ├── profile/            # Perfil
│   ├── settings/           # Configurações
│   └── products/           # Produtos
│       ├── page.tsx        # Listagem
│       ├── new/            # Cadastro
│       └── edit/[id]/      # Edição
│
├── components/
│   ├── ErrorBoundary.tsx   # Tratamento de erros
│   ├── ProtecaoRota.tsx    # Proteção de rotas
│   └── ui/                 # Componentes UI
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Toast.tsx
│       ├── ImageUpload.tsx
│       ├── Pagination.tsx
│       ├── Skeleton.tsx
│       └── AdvancedSearch.tsx
│
└── lib/
    ├── api.ts              # Cliente API
    ├── cache.ts            # Sistema de cache
    ├── validation.ts       # Validação
    └── hooks/
        ├── useApi.ts       # Hooks de API
        └── useDashboard.ts # Hook de dashboard
```

---

## 🧩 **COMPONENTES PRINCIPAIS**

### **Button**
```typescript
import Button from '@/components/ui/Button';

<Button variant="primary" size="md" icon="plus" onClick={handleClick}>
  Novo Produto
</Button>

// Variantes: primary, secondary, outline
// Tamanhos: sm, md, lg
// Ícones: plus, edit, trash, save, etc
```

### **Input**
```typescript
import Input from '@/components/ui/Input';

<Input
  label="Email"
  type="email"
  icon="mail"
  placeholder="seu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={erros.email}
  required
/>
```

### **Toast (Notificações)**
```typescript
import { useToast } from '@/components/ui/Toast';

const toast = useToast();

// Sucesso
toast.success('Produto criado!', 'Seu produto foi adicionado');

// Erro
toast.error('Erro!', 'Não foi possível salvar');

// Aviso
toast.warning('Atenção!', 'Verifique os dados');

// Info
toast.info('Nova versão', 'Atualização disponível');
```

### **ImageUpload**
```typescript
import ImageUpload from '@/components/ui/ImageUpload';

<ImageUpload
  onUpload={(url) => setImagemUrl(url)}
  onRemove={() => setImagemUrl('')}
  initialImage={produto.imagem_url}
  maxSize={5}
/>
```

### **Pagination**
```typescript
import Pagination from '@/components/ui/Pagination';

<Pagination
  currentPage={paginaAtual}
  totalPages={totalPaginas}
  onPageChange={(page) => setPaginaAtual(page)}
/>
```

### **AdvancedSearch**
```typescript
import AdvancedSearch from '@/components/ui/AdvancedSearch';

<AdvancedSearch
  onSearch={(filtros) => handleBusca(filtros)}
  categorias={['Eletrônicos', 'Roupas', 'Móveis']}
/>
```

### **Skeleton (Loading)**
```typescript
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

{carregando ? (
  <ProductCardSkeleton />
) : (
  <ProductCard produto={produto} />
)}
```

---

## 🪝 **HOOKS CUSTOMIZADOS**

### **useProdutos**
```typescript
import { useProdutos } from '@/lib/hooks/useApi';

const { 
  produtos, 
  carregando, 
  erro,
  carregarProdutos,
  criarProduto,
  atualizarProduto,
  excluirProduto,
  limparErro
} = useProdutos();

// Carregar produtos
await carregarProdutos(filtros);

// Criar produto
await criarProduto(dadosProduto);

// Atualizar produto
await atualizarProduto(id, dadosAtualizados);

// Excluir produto
await excluirProduto(id);
```

### **useAutenticacao**
```typescript
import { useAutenticacao } from '@/lib/hooks/useApi';

const {
  usuario,
  carregando,
  erro,
  fazerLogin,
  fazerLogout,
  verificarAutenticacao,
  estaAutenticado
} = useAutenticacao();

// Login
await fazerLogin(email, senha);

// Logout
fazerLogout();

// Verificar autenticação
const valido = await verificarAutenticacao();
```

### **useDashboard**
```typescript
import { useDashboard } from '@/lib/hooks/useDashboard';

const {
  stats,           // Estatísticas
  periodo,         // Período selecionado
  carregando,
  alterarPeriodo,
  recarregar
} = useDashboard();

// Alterar período
alterarPeriodo({
  inicio: new Date(),
  fim: new Date(),
  label: 'Últimos 30 dias'
});
```

### **useCategorias**
```typescript
import { useCategorias } from '@/lib/hooks/useApi';

const {
  categorias,
  carregando,
  erro,
  carregarCategorias
} = useCategorias();

// Carregar categorias
await carregarCategorias();
```

---

## ✅ **SISTEMA DE VALIDAÇÃO**

### **Validação Básica**
```typescript
import { validationRules, validate } from '@/lib/validation';

// Definir schema
const schema = {
  email: [
    validationRules.required('Email é obrigatório'),
    validationRules.email()
  ],
  senha: [
    validationRules.required('Senha é obrigatória'),
    validationRules.minLength(6)
  ]
};

// Validar dados
const errors = validate(dados, schema);

if (Object.keys(errors).length > 0) {
  // Tem erros
  console.log(errors);
}
```

### **Usar Hook de Validação**
```typescript
import { useValidation, schemas } from '@/lib/validation';

const { validateForm, validateField } = useValidation(schemas.produto);

// Validar formulário completo
const { isValid, errors } = validateForm(dadosProduto);

// Validar campo específico
const error = validateField('email', emailValue);
```

### **Schemas Pré-definidos**
```typescript
schemas.login       // Email + Senha
schemas.registro    // Nome + Email + Telefone + Senha
schemas.produto     // Nome + Descrição + Preço + Categoria
schemas.perfil      // Nome + Email + Telefone
```

### **Regras Disponíveis**
```typescript
validationRules.required()          // Campo obrigatório
validationRules.email()             // Email válido
validationRules.phone()             // Telefone válido
validationRules.minLength(6)        // Tamanho mínimo
validationRules.maxLength(100)      // Tamanho máximo
validationRules.min(0)              // Valor mínimo
validationRules.max(100)            // Valor máximo
validationRules.number()            // Deve ser número
validationRules.url()               // URL válida
validationRules.oneOf([])           // Deve ser um dos valores
validationRules.matches(/regex/)    // Deve corresponder ao padrão
validationRules.fileSize(5)         // Tamanho de arquivo (MB)
validationRules.fileType(['image']) // Tipo de arquivo
```

---

## 💾 **SISTEMA DE CACHE**

### **Usar Cache em Hooks**
```typescript
import { useCachedData, cacheStrategies } from '@/lib/cache';

const { 
  data, 
  loading, 
  error,
  refresh,      // Recarregar forçado
  invalidate    // Invalidar cache
} = useCachedData(
  'produtos-lista',                    // Chave
  () => api.listarProdutos(),          // Fetcher
  { 
    expiresIn: cacheStrategies.medium, // 5 minutos
    refreshInterval: 30000              // Auto-refresh a cada 30s
  }
);

// Recarregar dados
refresh();

// Invalidar cache e recarregar
invalidate();
```

### **Cache Manual**
```typescript
import { cacheManager } from '@/lib/cache';

// Salvar no cache
cacheManager.set('chave', dados, 5 * 60 * 1000); // 5 minutos

// Obter do cache
const dados = cacheManager.get('chave');

// Remover do cache
cacheManager.remove('chave');

// Limpar todo o cache
cacheManager.clear();
```

### **Estratégias de Cache**
```typescript
import { cacheStrategies } from '@/lib/cache';

cacheStrategies.short    // 1 minuto
cacheStrategies.medium   // 5 minutos
cacheStrategies.long     // 30 minutos
cacheStrategies.session  // Até fechar navegador
cacheStrategies.none     // Sem cache
```

### **Debounce e Throttle**
```typescript
import { debounce, throttle } from '@/lib/cache';

// Debounce: aguarda usuário parar de digitar
const handleSearch = debounce((termo) => {
  buscarProdutos(termo);
}, 500); // 500ms

// Throttle: limita taxa de chamadas
const handleScroll = throttle(() => {
  carregarMais();
}, 1000); // Máximo 1x por segundo
```

---

## 💡 **EXEMPLOS DE USO**

### **Exemplo 1: Criar Produto com Upload**
```typescript
'use client';

import { useState } from 'react';
import { useProdutos } from '@/lib/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import { useValidation, schemas } from '@/lib/validation';
import ImageUpload from '@/components/ui/ImageUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NovoProduto() {
  const [dados, setDados] = useState({ nome: '', preco: 0, imagemUrl: '' });
  const { criarProduto, carregando } = useProdutos();
  const toast = useToast();
  const { validateForm } = useValidation(schemas.produto);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors } = validateForm(dados);
    if (!isValid) {
      toast.error('Erro de validação', Object.values(errors)[0]);
      return;
    }

    try {
      await criarProduto(dados);
      toast.success('Produto criado!');
    } catch (error) {
      toast.error('Erro', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUpload onUpload={(url) => setDados({...dados, imagemUrl: url})} />
      <Input 
        label="Nome" 
        value={dados.nome}
        onChange={(e) => setDados({...dados, nome: e.target.value})}
      />
      <Button type="submit" loading={carregando}>
        Salvar
      </Button>
    </form>
  );
}
```

### **Exemplo 2: Lista com Cache e Busca**
```typescript
import { useCachedData } from '@/lib/cache';
import { useProdutos } from '@/lib/hooks/useApi';
import AdvancedSearch from '@/components/ui/AdvancedSearch';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function ListaProdutos() {
  const { data: produtos, loading } = useCachedData(
    'produtos',
    () => api.listarProdutos()
  );

  return (
    <>
      <AdvancedSearch onSearch={handleSearch} />
      
      {loading ? (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({length: 8}).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {produtos.map(p => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </>
  );
}
```

---

## 🎨 **CLASSES TAILWIND CUSTOMIZADAS**

### **Tipografia**
```css
.title-lg       /* 28px, bold, DM Sans */
.title-md       /* 24px, bold, DM Sans */
.title-sm       /* 18px, bold, DM Sans */
.subtitle       /* 16px, semibold, Poppins */
.body-md        /* 16px, regular, Poppins */
.body-sm        /* 14px, regular, Poppins */
.body-xs        /* 12px, regular, Poppins */
.label-md       /* 12px, medium, uppercase */
.action-md      /* 16px, medium */
```

### **Componentes**
```css
.card-base      /* Card branco com sombra */
.input-base     /* Input com border bottom */
.btn-primary    /* Botão laranja */
.btn-secondary  /* Botão cinza */
.btn-outline    /* Botão outlined */
```

### **Badges de Status**
```css
.badge-status-ativo     /* Verde */
.badge-status-inativo   /* Vermelho */
.badge-status-vendido   /* Azul */
.badge-status-rascunho  /* Laranja */
```

---

## 🚀 **COMANDOS ÚTEIS**

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 📚 **LINKS ÚTEIS**

- **Next.js:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Lucide Icons:** https://lucide.dev/icons

---

**Pronto para começar a desenvolver! 🚀**
