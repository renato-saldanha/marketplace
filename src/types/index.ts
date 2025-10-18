// Tipos para o sistema de marketplace
export interface Usuario {
  id: string;
  email: string;
  senha: string;
  nome: string;
  data_criacao: Date;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url?: string;
  categoria?: string;
  status: StatusProduto;
  vendedor_id: string;
  data_criacao: Date;
  data_atualizacao?: Date;
}

export type StatusProduto = 'ativo' | 'inativo' | 'vendido' | 'rascunho';

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
}

export interface FiltrosProduto {
  texto: string;
  status: StatusProduto | 'todos';
  limite: number;
  offset: number;
  categoria: string;
}

export interface DadosLogin {
  email: string;
  senha: string;
}

export interface DadosProduto {
  titulo: string;
  descricao: string;
  preco: number;
  categoria: string;
  status?: StatusProduto;
  imagem?: File | null;
  imagem_url?: string;
  imagem_data?: string;
}
