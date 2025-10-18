'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Tag } from 'lucide-react';
import Image from 'next/image';
import { FiltrosProduto } from '@/types';
import { useProdutos } from '@/lib/hooks/useApi';
import { obter_url_imagem_completa } from '@/lib/utils';
import ProtecaoRota from '@/components/ProtecaoRota';
import PageHeader from '@/components/PageHeader';

export default function PaginaProdutos() {
  const [filtros, setFiltros] = useState<FiltrosProduto>({
    texto: '',
    status: 'todos',
    categoria: '',
    limite: 12,
    offset: 0
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalProdutos, setTotalProdutos] = useState(0);
  
  const router = useRouter();
  const { produtos, carregando, carregarProdutos } = useProdutos();
  
  const totalPaginas = Math.ceil(totalProdutos / filtros.limite);

  const handleNovoProduto = () => {
    router.push('/produtos/novo');
  };

  const handleEditarProduto = (id: string) => {
    router.push(`/produtos/editar/${id}`);
  };

  const handleMudarPagina = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
    const novoOffset = (novaPagina - 1) * filtros.limite;
    setFiltros({...filtros, offset: novoOffset});
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      handleMudarPagina(paginaAtual - 1);
    }
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      handleMudarPagina(paginaAtual + 1);
    }
  };

  useEffect(() => {
    carregarProdutos(filtros);
    // Simular contagem total (em produção, viria da API)
    setTotalProdutos(produtos.length > 0 ? produtos.length * 3 : 0);
  }, [carregarProdutos, filtros, produtos.length]);

  return (
    <ProtecaoRota>
      <div className="min-h-screen bg-gray-50">
        <PageHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar de Filtros */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="subtitle text-gray-900 mb-4">Filtrar</h3>
                
                {/* Campo de Pesquisa */}
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Pesquisar"
                      value={filtros.texto}
                      onChange={(e) => setFiltros({...filtros, texto: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 body-md"
                    />
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={filtros.status}
                      onChange={(e) => setFiltros({...filtros, status: e.target.value as any})}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white body-md"
                    >
                      <option value="todos">Todos os status</option>
                      <option value="ativo">Ativo</option>
                      <option value="vendido">Vendido</option>
                      <option value="inativo">Inativo</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Botão Aplicar Filtro */}
                <button
                  onClick={() => carregarProdutos(filtros)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white action-md py-2 px-4 rounded-lg transition-colors"
                >
                  Aplicar filtro
                </button>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1">
              {/* Header da página */}
              <div className="mb-8">
                <h1 className="title-lg text-gray-900 mb-2">Seus produtos</h1>
                <p className="body-md text-gray-600">Acesse gerencie a sua lista de produtos à venda</p>
              </div>

              {/* Grid de Produtos */}
              <div className="grid grid-cols-3 gap-6">
                {carregando ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : produtos.length === 0 ? (
                  <div className="col-span-3 text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="title-sm text-gray-900 mb-2">Nenhum produto encontrado</h3>
                    <p className="body-md text-gray-500 mb-6">Comece criando seu primeiro produto!</p>
                    <button
                      onClick={handleNovoProduto}
                      className="bg-orange-500 hover:bg-orange-600 text-white action-md py-2 px-4 rounded-lg transition-colors"
                    >
                      Novo Produto
                    </button>
                  </div>
                ) : (
                  produtos.map((produto) => (
                    <div 
                      key={produto.id} 
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleEditarProduto(produto.id)}
                    >
                      {/* Imagem do produto */}
                      <div className="relative h-48 bg-gray-100">
                        {produto.imagem_url ? (
                          <Image
                            className="w-full h-full object-cover"
                            src={produto.imagem_url}
                            alt={produto.titulo || 'Produto sem nome'}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => {
                              console.error('Erro ao carregar imagem:', produto.imagem_url);
                            }}
                            onLoad={() => {
                              console.log('Imagem carregada com sucesso:', produto.imagem_url);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-12 h-12" />
                          </div>
                        )}
                        
                        {/* Tags de Status e Categoria */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded label-sm text-white ${
                            produto.status === 'ativo' 
                              ? 'bg-blue-600'
                              : produto.status === 'vendido'
                              ? 'bg-green-600'
                              : 'bg-gray-600'
                          }`}>
                            {produto.status === 'ativo' ? 'ANUNCIADO' : produto.status === 'vendido' ? 'VENDIDO' : 'DESATIVADO'}
                          </span>
                          {produto.categoria && (
                            <span className="px-2 py-1 rounded label-sm text-white bg-gray-600">
                              {produto.categoria.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Informações do produto */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="title-sm text-gray-900">{produto.titulo}</h3>
                          <span className="title-sm text-gray-900">
                            R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <p className="body-sm text-gray-600 line-clamp-2">
                          {produto.descricao}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Paginação */}
              {!carregando && produtos.length > 0 && totalPaginas > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={handlePaginaAnterior}
                    disabled={paginaAtual === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg body-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => {
                      const pagina = i + 1;
                      return (
                        <button
                          key={pagina}
                          onClick={() => handleMudarPagina(pagina)}
                          className={`w-10 h-10 rounded-lg body-md font-medium transition-colors ${
                            paginaAtual === pagina
                              ? 'bg-orange-500 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pagina}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={handleProximaPagina}
                    disabled={paginaAtual === totalPaginas}
                    className="px-4 py-2 border border-gray-300 rounded-lg body-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima
                  </button>
                  
                  <span className="ml-4 body-sm text-gray-500">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>

      </div>
    </ProtecaoRota>
  );
}