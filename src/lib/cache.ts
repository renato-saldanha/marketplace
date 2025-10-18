// Sistema de cache para otimização de requisições

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private cache: Map<string, CacheItem<any>>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  // Adicionar item ao cache
  set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void { // 5 minutos padrão
    // Remover items mais antigos se cache estiver cheio
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value as string | undefined;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  // Obter item do cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  // Remover item do cache
  remove(key: string): void {
    this.cache.delete(key);
  }

  // Limpar cache por padrão (regex)
  removeByPattern(pattern: RegExp): void {
    for (const key of Array.from(this.cache.keys())) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  // Limpar todo o cache
  clear(): void {
    this.cache.clear();
  }

  // Obter tamanho do cache
  size(): number {
    return this.cache.size;
  }

  // Verificar se uma chave existe e não expirou
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

// Instância global do cache
export const cacheManager = new CacheManager();

// Helper para criar chaves de cache
export function createCacheKey(prefix: string, params?: Record<string, any>): string {
  if (!params) return prefix;

  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');

  return `${prefix}::${sortedParams}`;
}

// Decorator para cachear resultados de funções
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyPrefix?: string;
    expiresIn?: number;
    keyGenerator?: (...args: any[]) => string;
  } = {}
): T {
  const {
    keyPrefix = fn.name || 'cached',
    expiresIn = 5 * 60 * 1000,
    keyGenerator = (...args: any[]) => createCacheKey(keyPrefix, { args: JSON.stringify(args) })
  } = options;

  return (async (...args: any[]) => {
    const cacheKey = keyGenerator(...args);

    // Tentar obter do cache
    const cached = cacheManager.get(cacheKey);
    if (cached !== null) {
      console.log(`[Cache HIT] ${cacheKey}`);
      return cached;
    }

    // Executar função e cachear resultado
    console.log(`[Cache MISS] ${cacheKey}`);
    const result = await fn(...args);
    cacheManager.set(cacheKey, result, expiresIn);

    return result;
  }) as T;
}

// Hook para usar cache em componentes React
import { useState, useEffect, useCallback } from 'react';

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    expiresIn?: number;
    refreshInterval?: number;
  } = {}
) {
  const { expiresIn = 5 * 60 * 1000, refreshInterval } = options;
  const [data, setData] = useState<T | null>(() => cacheManager.get<T>(key));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (force: boolean = false) => {
    // Se não forçar, tentar usar cache primeiro
    if (!force) {
      const cached = cacheManager.get<T>(key);
      if (cached !== null) {
        setData(cached);
        setLoading(false);
        return cached;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cacheManager.set(key, result, expiresIn);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, expiresIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh automático
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchData(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchData(true),
    invalidate: () => {
      cacheManager.remove(key);
      fetchData(true);
    }
  };
}

// Estratégias de cache pré-configuradas
export const cacheStrategies = {
  // Cache de curta duração (1 minuto)
  short: 60 * 1000,

  // Cache de média duração (5 minutos)
  medium: 5 * 60 * 1000,

  // Cache de longa duração (30 minutos)
  long: 30 * 60 * 1000,

  // Cache de sessão (até fechar o navegador)
  session: Infinity,

  // Sem cache
  none: 0
};

// Invalidação de cache por tags
class TaggedCacheManager extends CacheManager {
  private tags: Map<string, Set<string>>;

  constructor(maxSize?: number) {
    super(maxSize);
    this.tags = new Map();
  }

  setWithTags<T>(
    key: string,
    data: T,
    tags: string[],
    expiresIn?: number
  ): void {
    super.set(key, data, expiresIn);

    // Associar tags à chave
    for (const tag of tags) {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag)!.add(key);
    }
  }

  invalidateByTag(tag: string): void {
    const keys = this.tags.get(tag);
    if (!keys) return;

    for (const key of keys) {
      this.remove(key);
    }

    this.tags.delete(tag);
  }

  invalidateByTags(tags: string[]): void {
    for (const tag of tags) {
      this.invalidateByTag(tag);
    }
  }
}

// Instância de cache com tags
export const taggedCache = new TaggedCacheManager();

// Utilitário para debounce (evitar chamadas excessivas)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utilitário para throttle (limitar taxa de chamadas)
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
