import React from 'react';
import { Package, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import Button from './Button';
import { cn, obter_url_imagem_completa } from '@/lib/utils';

interface PropsCardProduto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  status: 'ativo' | 'inativo' | 'vendido' | 'rascunho';
  imagemUrl?: string;
  categoria?: string;
  aoEditar?: (id: string) => void;
  aoExcluir?: (id: string) => void;
  aoVisualizar?: (id: string) => void;
}

const configuracaoStatus = {
  ativo: {
    rotulo: 'Ativo',
    classe: 'badge-status badge-status-ativo'
  },
  inativo: {
    rotulo: 'Inativo',
    classe: 'badge-status badge-status-inativo'
  },
  vendido: {
    rotulo: 'Vendido',
    classe: 'badge-status badge-status-vendido'
  },
  rascunho: {
    rotulo: 'Rascunho',
    classe: 'badge-status badge-status-rascunho'
  }
};

const CardProduto: React.FC<PropsCardProduto> = ({
  id,
  nome,
  descricao,
  preco,
  status,
  imagemUrl,
  categoria,
  aoEditar,
  aoExcluir,
  aoVisualizar
}) => {
  const infoStatus = configuracaoStatus[status];

  return (
    <div className="card-base p-4 hover:shadow-lg transition-all duration-200">
      {/* Imagem do produto */}
      <div className="relative mb-4">
        <div className="w-full h-48 bg-shape rounded-lg flex items-center justify-center overflow-hidden">
          {imagemUrl ? (
            <img 
              src={obter_url_imagem_completa(imagemUrl)} 
              alt={nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-200">
              <Package className="h-12 w-12 mb-2" />
              <span className="body-xs">Sem imagem</span>
            </div>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <span className={infoStatus.classe}>
            {infoStatus.rotulo}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="title-sm text-gray-400 mb-1 line-clamp-1">
            {nome}
          </h3>
          <p className="body-sm text-gray-200 line-clamp-2">
            {descricao}
          </p>
        </div>

        {categoria && (
          <div className="flex items-center gap-2">
            <span className="body-xs text-gray-200 bg-shape px-2 py-1 rounded">
              {categoria}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="title-sm text-orange-base">
            R$ {preco.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            icon="edit"
            onClick={() => aoEditar?.(id)}
            className="flex-1"
          >
            Editar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon="eye"
            onClick={() => aoVisualizar?.(id)}
            className="flex-1"
          >
            Ver
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon="trash"
            onClick={() => aoExcluir?.(id)}
            className="px-3 text-danger hover:bg-danger/10"
          />
        </div>
      </div>
    </div>
  );
};

export default CardProduto;
