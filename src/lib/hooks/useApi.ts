// Hook personalizado para usar a API
import { useState, useCallback, useEffect } from 'react';
import { clienteAPI, Produto, DadosProduto, FiltrosProduto, Usuario } from '../api';
import { CacheProdutos } from '../cache-produtos';

// Hook para gerenciar estado de loading e erro
export function useEstadoApi() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const executarComEstado = useCallback(async <T>(
    operacao: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Log de debug em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Executando operação...');
      }
      
      const resultado = await operacao();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Operação concluída com sucesso:', resultado);
      }
      
      return resultado;
    } catch (error: unknown) {
      let mensagem = 'Erro desconhecido';
      
      // Tratar diferentes tipos de erro
      if (error instanceof Error) {
        mensagem = error.message;
        } else if (error && typeof error === 'object' && 'response' in error) {
        // Erro do Axios com resposta
        const axiosError = error as { response: { data: unknown } };
        const data = axiosError.response.data;
        if (typeof data === 'string') {
          mensagem = data;
        } else if (data && typeof data === 'object' && 'detail' in data) {
          // Tratar array de detalhes (validação Pydantic)
          const detailData = data as { detail: unknown };
          if (Array.isArray(detailData.detail)) {
            mensagem = detailData.detail.map((d: { msg?: string; message?: string }) => d.msg || d.message || String(d)).join(', ');
          } else {
            mensagem = String(detailData.detail);
          }
        } else if (data && typeof data === 'object' && 'message' in data) {
          const messageData = data as { message: string };
          mensagem = messageData.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const errorWithMessage = error as { message: string };
        mensagem = errorWithMessage.message;
      }
      
      setErro(mensagem);
      console.error('Erro na operação:', {
        error,
        message: mensagem,
        stack: error && typeof error === 'object' && 'stack' in error ? (error as { stack: string }).stack : undefined
      });
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  const limparErro = useCallback(() => {
    setErro(null);
  }, []);

  return {
    carregando,
    erro,
    executarComEstado,
    limparErro,
  };
}

// Hook para produtos
export function useProdutos() {
  const { carregando, erro, executarComEstado, limparErro } = useEstadoApi();
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const carregarProdutos = useCallback(async (filtros?: FiltrosProduto, usarCache = true) => {
    // Tentar obter do cache primeiro
    if (usarCache) {
      const produtosCache = CacheProdutos.obter(filtros);
      if (produtosCache) {
        setProdutos(produtosCache);
        return produtosCache;
      }
    }
    
    // Se não houver cache ou não usar cache, buscar da API
    const resultado = await executarComEstado(() => 
      clienteAPI.listarMeusProdutos(filtros)
    );
    
    if (resultado) {
      setProdutos(resultado);
      // Salvar no cache
      CacheProdutos.salvar(resultado, filtros);
    }
    
    return resultado;
  }, [executarComEstado]);

  const obterProduto = useCallback(async (id: string) => {
    const resultado = await executarComEstado(() => 
      clienteAPI.obterProduto(id)
    );
    
    return resultado;
  }, [executarComEstado]);

  const criarProduto = useCallback(async (dados: DadosProduto) => {
    const resultado = await executarComEstado(() => 
      clienteAPI.criarProduto(dados)
    );
    
    if (resultado) {
      // Invalidar cache
      CacheProdutos.limparTodos();
      // Recarregar lista de produtos sem usar cache
      await carregarProdutos(undefined, false);
    }
    
    return resultado;
  }, [executarComEstado, carregarProdutos]);

  const atualizarProduto = useCallback(async (id: string, dados: Partial<DadosProduto>) => {
    const resultado = await executarComEstado(() => 
      clienteAPI.atualizarProduto(id, dados)
    );
    
    if (resultado) {
      // Invalidar cache
      CacheProdutos.invalidarPorProduto(id);
      // Atualizar produto na lista
      setProdutos(prev => prev.map(p => p.id === id ? resultado : p));
    }
    
    return resultado;
  }, [executarComEstado]);

  const excluirProduto = useCallback(async (id: string) => {
    const resultado = await executarComEstado(() => 
      clienteAPI.excluirProduto(id)
    );
    
    if (resultado) {
      // Invalidar cache
      CacheProdutos.invalidarPorProduto(id);
      // Remover produto da lista
      setProdutos(prev => prev.filter(p => p.id !== id));
    }
    
    return resultado;
  }, [executarComEstado]);

  return {
    produtos,
    carregando,
    erro,
    carregarProdutos,
    obterProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto,
    limparErro,
  };
}

// Hook para autenticação
export function useAutenticacao() {
  const { carregando, erro, executarComEstado, limparErro } = useEstadoApi();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const fazerLogin = useCallback(async (email: string, senha: string) => {
    console.log('🔐 Iniciando login com:', { email, senha: '***' });
    
    const resultado = await executarComEstado(() => {
      console.log('📡 Chamando clienteAPI.fazerLogin...');
      return clienteAPI.fazerLogin({ email, senha });
    });
    
    console.log('📥 Resultado do login:', resultado);
    
    if (resultado) {
      console.log('✅ Login bem-sucedido, salvando dados do usuário...');
      setUsuario(resultado.usuario);
      // Salvar dados do usuário
      if (typeof window !== 'undefined') {
        localStorage.setItem('usuario_email', resultado.usuario.email);
        localStorage.setItem('usuario_nome', resultado.usuario.nome);
        localStorage.setItem('usuario_id', resultado.usuario.id);
        if (resultado.usuario.foto_perfil_thumb) {
          localStorage.setItem('usuario_foto', resultado.usuario.foto_perfil_thumb);
        }
        console.log('💾 Dados salvos no localStorage');
      }
    } else {
      console.log('❌ Login falhou - resultado é null');
    }
    
    return resultado;
  }, [executarComEstado]);

  const registrarUsuario = useCallback(async (nome: string, email: string, senha: string, foto_perfil_url?: string, foto_perfil_data?: string) => {
    const resultado = await executarComEstado(() => {
      return clienteAPI.registrarUsuario({ nome, email, senha, foto_perfil_url, foto_perfil_data });
    });
    
    console.log('📥 Resultado do registro:', resultado);
    
    if (resultado) {
      console.log('✅ Registro bem-sucedido, salvando dados do usuário...');
      setUsuario(resultado);
      // Salvar dados do usuário
      if (typeof window !== 'undefined') {
        localStorage.setItem('usuario_email', resultado.email);
        localStorage.setItem('usuario_nome', resultado.nome);
        localStorage.setItem('usuario_id', resultado.id);
        if (resultado.foto_perfil_thumb) {
          localStorage.setItem('usuario_foto', resultado.foto_perfil_thumb);
        }
        console.log('💾 Dados salvos no localStorage');
      }
    } else {
      console.log('❌ Registro falhou - resultado é null');
    }
    
    return resultado;
  }, [executarComEstado]);

  const fazerLogout = useCallback(() => {
    clienteAPI.fazerLogout();
    setUsuario(null);
  }, []);

  const verificarAutenticacao = useCallback(async () => {
    if (!clienteAPI.estaAutenticado()) {
      return false;
    }

    const resultado = await executarComEstado(() => 
      clienteAPI.obterUsuarioAtual()
    );
    
    if (resultado) {
      setUsuario(resultado);
      return true;
    }
    
    return false;
  }, [executarComEstado]);

  const atualizarPerfil = useCallback(async (dados: { nome?: string; foto_perfil_data?: string }) => {
    const resultado = await executarComEstado(() => 
      clienteAPI.atualizarPerfil(dados)
    );
    
    if (resultado) {
      setUsuario(resultado);
      // Atualizar dados no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('usuario_nome', resultado.nome);
        if (resultado.foto_perfil_thumb) {
          localStorage.setItem('usuario_foto', resultado.foto_perfil_thumb);
        }
      }
    }
    
    return resultado;
  }, [executarComEstado]);

  const alterarSenha = useCallback(async (dados: { senha_atual: string; nova_senha: string }) => {
    const resultado = await executarComEstado(() => 
      clienteAPI.alterarSenha(dados)
    );
    
    return resultado;
  }, [executarComEstado]);

  const excluirConta = useCallback(async () => {
    const resultado = await executarComEstado(() => 
      clienteAPI.excluirConta()
    );
    
    if (resultado) {
      // Fazer logout após exclusão
      clienteAPI.fazerLogout();
      setUsuario(null);
    }
    
    return resultado;
  }, [executarComEstado]);

  // Carregar dados do usuário automaticamente quando o hook é montado
  useEffect(() => {
    const carregarUsuario = async () => {
      if (clienteAPI.estaAutenticado() && !usuario) {
        await verificarAutenticacao();
      }
    };
    
    carregarUsuario();
  }, [verificarAutenticacao, usuario]);

  return {
    usuario,
    carregando,
    erro,
    fazerLogin,
    registrarUsuario,
    fazerLogout,
    verificarAutenticacao,
    atualizarPerfil,
    alterarSenha,
    excluirConta,
    limparErro,
    estaAutenticado: clienteAPI.estaAutenticado(),
  };
}

export function useCategorias() {
  const { carregando, erro, executarComEstado, limparErro } = useEstadoApi();
  const [categorias, setCategorias] = useState<string[]>([]);

  const carregarCategorias = useCallback(async () => {
    const resultado = await executarComEstado(() => 
      clienteAPI.listarCategorias()
    );
    
    if (resultado) {
      setCategorias(resultado);
    }
    
    return resultado;
  }, [executarComEstado]);

  return {
    categorias,
    carregando,
    erro,
    carregarCategorias,
    limparErro,
  };
}
