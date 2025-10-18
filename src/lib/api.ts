// Cliente API para comunicação com o backend FastAPI usando Axios
import { apiUtils, axiosInstance, API_BASE_URL } from './axios-config';

// Tipos para as respostas da API
export interface RespostaLogin {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  ativo: boolean;
  foto_perfil_url?: string;
  foto_perfil_thumb?: string;
  foto_perfil_medium?: string;
  foto_perfil_original?: string;
  data_criacao: string;
  data_atualizacao?: string;
}

export interface Produto {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  imagem_url?: string;
  categoria?: string;
  status: 'ativo' | 'inativo' | 'vendido' | 'rascunho';
  vendedor_id: string;
  data_criacao: string;
  data_atualizacao?: string;
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
  status?: 'ativo' | 'inativo' | 'vendido' | 'rascunho';
  imagem_data?: string;
}

export interface FiltrosProduto {
  texto?: string;
  status?: 'ativo' | 'inativo' | 'vendido' | 'rascunho' | 'todos';
  categoria?: string;
  limite?: number;
  offset?: number;
}

export interface ConfiguracaoUsuario {
  id: string;
  usuario_id: string;
  notificacoes_email: boolean;
  notificacoes_push: boolean;
  notificacoes_vendas: boolean;
  notificacoes_mensagens: boolean;
  notificacoes_promocoes: boolean;
  perfil_publico: boolean;
  mostrar_contato: boolean;
  mostrar_email: boolean;
  tema_preferido: string;
  idioma_preferido: string;
  compartilhar_analytics: boolean;
  receber_newsletter: boolean;
  data_criacao: string;
  data_atualizacao?: string;
}

// Classe para gerenciar requisições HTTP com Axios
export class ClienteAPI {
  private token: string | null = null;

  constructor() {
    // Recuperar token do localStorage se existir
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token_autenticacao');
    }
  }

  // Definir token de autenticação
  definirToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token_autenticacao', token);
      } else {
        localStorage.removeItem('token_autenticacao');
      }
    }
  }

  // Métodos de autenticação
  async fazerLogin(dados: DadosLogin): Promise<RespostaLogin> {
    console.log('🌐 ClienteAPI.fazerLogin chamado com:', dados);
    console.log('🔗 URL base da API:', API_BASE_URL);
    
    try {
      const resposta = await apiUtils.post<RespostaLogin>('/auth/login', dados);
      console.log('✅ Resposta recebida do backend:', resposta);
      
      // Salvar token
      this.definirToken(resposta.access_token);
      console.log('🔑 Token salvo:', resposta.access_token ? 'SIM' : 'NÃO');
      
      return resposta;
    } catch (error) {
      console.error('❌ Erro no ClienteAPI.fazerLogin:', error);
      throw error;
    }
  }

  async registrarUsuario(dados: DadosLogin & { nome: string; foto_perfil_url?: string; foto_perfil_data?: string }): Promise<Usuario> {
    return apiUtils.post<Usuario>('/auth/registrar', dados);
  }

  async obterUsuarioAtual(): Promise<Usuario> {
    return apiUtils.get<Usuario>('/auth/me');
  }

  async atualizarPerfil(dados: { nome?: string; foto_perfil_data?: string }): Promise<Usuario> {
    return apiUtils.put<Usuario>('/auth/me', dados);
  }

  async alterarSenha(dados: { senha_atual: string; nova_senha: string }): Promise<{ mensagem: string }> {
    return apiUtils.put<{ mensagem: string }>('/auth/me/alterar-senha', dados);
  }

  // Métodos de configurações
  async obterConfiguracao(): Promise<ConfiguracaoUsuario> {
    return apiUtils.get<ConfiguracaoUsuario>('/configuracao/me');
  }

  async atualizarConfiguracao(dados: Partial<ConfiguracaoUsuario>): Promise<ConfiguracaoUsuario> {
    return apiUtils.put<ConfiguracaoUsuario>('/configuracao/me', dados);
  }

  async resetarConfiguracao(): Promise<ConfiguracaoUsuario> {
    return apiUtils.post<ConfiguracaoUsuario>('/configuracao/me/reset');
  }

  // Método para exportar dados
  async exportarDados(): Promise<any> {
    return apiUtils.get<any>('/auth/me/exportar-dados');
  }

  // Método para excluir conta
  async excluirConta(): Promise<{ mensagem: string }> {
    return apiUtils.delete<{ mensagem: string }>('/auth/me');
  }

  // Métodos de produtos
  async listarProdutos(filtros?: FiltrosProduto): Promise<Produto[]> {
    const params = this.construirParametros(filtros);
    return apiUtils.get<Produto[]>('/produtos/', params);
  }

  async listarMeusProdutos(filtros?: FiltrosProduto): Promise<Produto[]> {
    const params = this.construirParametros(filtros);
    return apiUtils.get<Produto[]>('/produtos/meus', params);
  }

  async obterProduto(id: string): Promise<Produto> {
    return apiUtils.get<Produto>(`/produtos/${id}`);
  }

  async criarProduto(dados: DadosProduto): Promise<Produto> {
    return apiUtils.post<Produto>('/produtos/', dados);
  }

  async atualizarProduto(id: string, dados: Partial<DadosProduto>): Promise<Produto> {
    return apiUtils.put<Produto>(`/produtos/${id}`, dados);
  }

  async excluirProduto(id: string): Promise<{ mensagem: string }> {
    return apiUtils.delete<{ mensagem: string }>(`/produtos/${id}`);
  }

  async listarCategorias(): Promise<string[]> {
    return apiUtils.get<string[]>('/produtos/categorias/lista');
  }

  // Métodos auxiliares
  private construirParametros(filtros?: FiltrosProduto): Record<string, string | number> {
    const params: Record<string, string | number> = {};
    
    if (filtros?.texto) params.texto = filtros.texto;
    if (filtros?.status && filtros.status !== 'todos') params.status = filtros.status;
    if (filtros?.categoria) params.categoria = filtros.categoria;
    if (filtros?.limite) params.limite = filtros.limite;
    if (filtros?.offset) params.offset = filtros.offset;

    return params;
  }

  // Fazer logout
  fazerLogout() {
    this.definirToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuario_email');
      localStorage.removeItem('usuario_nome');
      localStorage.removeItem('usuario_id');
    }
  }

  // Verificar se está autenticado
  estaAutenticado(): boolean {
    return !!this.token;
  }

  // Obter instância do Axios (para uso avançado)
  obterInstanciaAxios() {
    return axiosInstance;
  }
}

// Instância global do cliente API
export const clienteAPI = new ClienteAPI();

// Hook para usar o cliente API
export function usarClienteAPI() {
  return clienteAPI;
}

// Utilitários para upload de arquivos
export class UploadService {
  private clienteAPI: ClienteAPI;

  constructor(clienteAPI: ClienteAPI) {
    this.clienteAPI = clienteAPI;
  }

  async fazerUploadImagem(arquivo: File, produtoId?: string): Promise<string> {
    const additionalData = produtoId ? { produto_id: produtoId } : undefined;
    const response = await apiUtils.upload<{ url: string }>('/upload/imagem', arquivo, additionalData);
    return response.url;
  }

  validarArquivo(arquivo: File): { valido: boolean; erro?: string } {
    // Validar tipo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      return { valido: false, erro: 'Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.' };
    }

    // Validar tamanho (5MB)
    const tamanhoMaximo = 5 * 1024 * 1024;
    if (arquivo.size > tamanhoMaximo) {
      return { valido: false, erro: 'Arquivo muito grande. Máximo 5MB.' };
    }

    return { valido: true };
  }
}

// Instância do serviço de upload
export const uploadService = new UploadService(clienteAPI);