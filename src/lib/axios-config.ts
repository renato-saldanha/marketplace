// Configuração centralizada do Axios
import axios from 'axios';

// URL base do servidor (sem /api)
export const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

// URL base da API (com /api)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${SERVER_BASE_URL}/api`;

// Configurações padrão do Axios
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
};

// Criar instância base do Axios
export const axiosInstance = axios.create(axiosConfig);

// Interceptor de requisição para adicionar token automaticamente
axiosInstance.interceptors.request.use(
  (config) => {
    // Adicionar token se existir
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token_autenticacao');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log da requisição em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros
axiosInstance.interceptors.response.use(
  (response) => {
    // Log da resposta em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Log do erro
    console.error('❌ Erro na resposta:', {
      status: error.response?.status,
      message: error.response?.data?.detail || error.message,
      url: error.config?.url,
    });

    // Tratar erros específicos
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token_autenticacao');
        localStorage.removeItem('usuario_email');
        localStorage.removeItem('usuario_nome');
        localStorage.removeItem('usuario_id');
        
        // Redirecionar para login se não estiver na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    if (error.response?.status === 403) {
      // Acesso negado
      throw new Error('Você não tem permissão para realizar esta ação.');
    }

    if (error.response?.status === 404) {
      // Recurso não encontrado
      throw new Error('Recurso não encontrado.');
    }

    if (error.response?.status >= 500) {
      // Erro do servidor
      throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
    }

    if (!error.response) {
      // Erro de rede
      throw new Error('Erro de conexão. Verifique sua internet.');
    }

    // Erro personalizado da API
    let mensagem = 'Erro desconhecido';
    const data = error.response.data;
    
    if (data) {
      if (typeof data === 'string') {
        mensagem = data;
      } else if (data.detail) {
        // Tratar array de detalhes (validação Pydantic)
        if (Array.isArray(data.detail)) {
          mensagem = data.detail.map((d: any) => d.msg || d.message || d).join(', ');
        } else {
          mensagem = data.detail;
        }
      } else if (data.message) {
        mensagem = data.message;
      }
    }
    
    throw new Error(mensagem);
  }
);

// Utilitários para requisições
export const apiUtils = {
  // Fazer requisição GET
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },

  // Fazer requisição POST
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  // Fazer requisição PUT
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await axiosInstance.put(url, data);
    return response.data;
  },

  // Fazer requisição DELETE
  async delete<T>(url: string): Promise<T> {
    const response = await axiosInstance.delete(url);
    return response.data;
  },

  // Fazer upload de arquivo
  async upload<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

// Exportar instância configurada
export default axiosInstance;
