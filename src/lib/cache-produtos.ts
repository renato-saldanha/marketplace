/**
 * Sistema de cache inteligente para produtos
 */

import { Produto, FiltrosProduto } from './api';

interface CacheEntry {
  data: Produto[];
  timestamp: number;
  filtros: FiltrosProduto;
}

const CACHE_KEY_PREFIX = 'produtos_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em millisegundos

export class CacheProdutos {
  /**
   * Gerar chave de cache baseada nos filtros
   */
  private static gerarChaveCache(filtros?: FiltrosProduto): string {
    if (!filtros) return `${CACHE_KEY_PREFIX}all`;
    
    const partes = [
      filtros.texto || '',
      filtros.status || '',
      filtros.categoria || '',
      filtros.limite || '',
      filtros.offset || ''
    ];
    
    return `${CACHE_KEY_PREFIX}${partes.join('_')}`;
  }

  /**
   * Salvar produtos no cache
   */
  static salvar(produtos: Produto[], filtros?: FiltrosProduto): void {
    if (typeof window === 'undefined') return;
    
    const chave = this.gerarChaveCache(filtros);
    const entry: CacheEntry = {
      data: produtos,
      timestamp: Date.now(),
      filtros: filtros || {}
    };
    
    try {
      localStorage.setItem(chave, JSON.stringify(entry));
    } catch (error) {
      console.warn('Erro ao salvar cache:', error);
      // Se o localStorage estiver cheio, limpar caches antigos
      this.limparCachesAntigos();
    }
  }

  /**
   * Obter produtos do cache
   */
  static obter(filtros?: FiltrosProduto): Produto[] | null {
    if (typeof window === 'undefined') return null;
    
    const chave = this.gerarChaveCache(filtros);
    const item = localStorage.getItem(chave);
    
    if (!item) return null;
    
    try {
      const entry: CacheEntry = JSON.parse(item);
      
      // Verificar se o cache ainda é válido
      const idade = Date.now() - entry.timestamp;
      if (idade > CACHE_DURATION) {
        // Cache expirado
        localStorage.removeItem(chave);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.warn('Erro ao ler cache:', error);
      localStorage.removeItem(chave);
      return null;
    }
  }

  /**
   * Limpar cache específico
   */
  static limpar(filtros?: FiltrosProduto): void {
    if (typeof window === 'undefined') return;
    
    const chave = this.gerarChaveCache(filtros);
    localStorage.removeItem(chave);
  }

  /**
   * Limpar todos os caches de produtos
   */
  static limparTodos(): void {
    if (typeof window === 'undefined') return;
    
    const chaves = Object.keys(localStorage);
    chaves.forEach(chave => {
      if (chave.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(chave);
      }
    });
  }

  /**
   * Limpar caches antigos (mais de 1 hora)
   */
  static limparCachesAntigos(): void {
    if (typeof window === 'undefined') return;
    
    const agora = Date.now();
    const chaves = Object.keys(localStorage);
    
    chaves.forEach(chave => {
      if (chave.startsWith(CACHE_KEY_PREFIX)) {
        try {
          const item = localStorage.getItem(chave);
          if (item) {
            const entry: CacheEntry = JSON.parse(item);
            const idade = agora - entry.timestamp;
            
            // Remover caches com mais de 1 hora
            if (idade > 60 * 60 * 1000) {
              localStorage.removeItem(chave);
            }
          }
        } catch (error) {
          // Se houver erro ao parsear, remover o item
          localStorage.removeItem(chave);
        }
      }
    });
  }

  /**
   * Invalidar cache quando um produto é modificado
   */
  static invalidarPorProduto(produtoId: string): void {
    // Quando um produto é atualizado/criado/excluído, invalidar todos os caches
    // para garantir consistência
    this.limparTodos();
  }
}

