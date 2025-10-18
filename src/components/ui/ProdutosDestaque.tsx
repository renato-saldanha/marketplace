import { Star, TrendingUp, Eye } from 'lucide-react';
import { Produto } from '@/lib/api';
import { obter_url_imagem_completa } from '@/lib/utils';
import Image from 'next/image';

interface ProdutosDestaqueProps {
  produtos: Produto[];
  loading?: boolean;
  onProdutoClick?: (produtoId: string) => void;
}

export default function ProdutosDestaque({ produtos, loading = false, onProdutoClick }: ProdutosDestaqueProps) {
  // Simular dados de destaque baseados nos produtos
  const produtosComDestaque = produtos.slice(0, 3).map(produto => ({
    ...produto,
    visualizacoes: Math.floor(Math.random() * 500) + 100,
    avaliacao: 4.0 + Math.random() * 1.0, // Entre 4.0 e 5.0
    tendencia: Math.floor(Math.random() * 20) + 5, // Entre 5% e 25%
  }));

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!produtos || produtos.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto em destaque</h3>
        <p className="text-gray-500 mb-4">Cadastre produtos para vê-los aqui</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos em Destaque</h3>
      
      {produtosComDestaque.map((produto) => (
        <div 
          key={produto.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onProdutoClick?.(produto.id)}
        >
          <div className="flex items-center gap-4">
            {/* Imagem do produto */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={obter_url_imagem_completa(produto.imagem_url) || '/placeholder.png'}
                alt={produto.titulo}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Informações do produto */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {produto.titulo}
              </h4>
              <p className="text-lg font-bold text-orange-600">
                R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              
              {/* Métricas */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{produto.visualizacoes} visualizações</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{produto.avaliacao.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{produto.tendencia}%</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                produto.status === 'ativo' 
                  ? 'bg-green-100 text-green-800'
                  : produto.status === 'vendido'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {produto.status === 'ativo' ? 'Ativo' : 
                 produto.status === 'vendido' ? 'Vendido' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
