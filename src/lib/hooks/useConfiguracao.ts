import { useState, useEffect, useCallback } from 'react';
import { useEstadoApi } from './useApi';
import { clienteAPI, ConfiguracaoUsuario } from '../api';

export function useConfiguracao() {
  const { carregando, erro, executarComEstado, limparErro } = useEstadoApi();
  const [configuracao, setConfiguracao] = useState<ConfiguracaoUsuario | null>(null);

  const carregarConfiguracao = useCallback(async () => {
    const resultado = await executarComEstado(() => 
      clienteAPI.obterConfiguracao()
    );
    
    if (resultado) {
      setConfiguracao(resultado);
    }
    
    return resultado;
  }, [executarComEstado]);

  const atualizarConfiguracao = useCallback(async (dados: Partial<ConfiguracaoUsuario>) => {
    const resultado = await executarComEstado(() => 
      clienteAPI.atualizarConfiguracao(dados)
    );
    
    if (resultado) {
      setConfiguracao(resultado);
    }
    
    return resultado;
  }, [executarComEstado]);

  const resetarConfiguracao = useCallback(async () => {
    const resultado = await executarComEstado(() => 
      clienteAPI.resetarConfiguracao()
    );
    
    if (resultado) {
      setConfiguracao(resultado);
    }
    
    return resultado;
  }, [executarComEstado]);

  // Carregar configurações automaticamente quando o hook é montado
  useEffect(() => {
    carregarConfiguracao();
  }, [carregarConfiguracao]);

  return {
    configuracao,
    carregando,
    erro,
    carregarConfiguracao,
    atualizarConfiguracao,
    resetarConfiguracao,
    limparErro,
  };
}
