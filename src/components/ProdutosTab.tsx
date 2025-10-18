'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Tag } from 'lucide-react';
import Image from 'next/image';
import { FiltrosProduto } from '@/types';
import { Produto } from '@/lib/api';
import { useProdutos } from '@/lib/hooks/useApi';
import Button from '@/components/ui/Button';
import CardProduto from '@/components/ui/CardProduto';
import Pagination from '@/components/ui/Pagination';
import { SkeletonCardProduto, SkeletonListaProdutos } from '@/components/ui/Skeleton';

export default function ProductsTab() {
  const [filtros, setFiltros] = useState<FiltrosProduto>({
    texto: '',
    status: 'todos',
    categoria: '',
    limite: 12,
    offset: 0
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const router = useRouter();
  
  const { produtos, carregando, erro, carregarProdutos, excluirProduto } = useProdutos();
  
  const totalProdutos = produtos.length;

  useEffect(() => {
    carregarProdutos(filtros);
  }, [filtros, carregarProdutos]);

  useEffect(() => {
    const novoOffset = (paginaAtual - 1) * (filtros.limite || 12);
    setFiltros(prev => ({
      ...prev,
      offset: novoOffset
    }));
  }, [paginaAtual, filtros.limite]);

  const totalPages = Math.ceil(totalProdutos / (filtros.limite || 12));

  const handlePageChange = (page: number) => {
    setPaginaAtual(page);
  };


  const handleNovoProduto = () => {
    router.push('/produtos/novo');
  };

  const handleExcluirProduto = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await excluirProduto(id);
      carregarProdutos(filtros);
    }
  };

  const handleEditarProduto = (id: string) => {
    router.push(`/produtos/editar/${id}`);
  };

  const handleVerProduto = (id: string) => {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      setProdutoSelecionado(produto);
      setModalAberto(true);
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProdutoSelecionado(null);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-green-600 bg-green-100';
      case 'inativo': return 'text-red-600 bg-red-100';
      case 'vendido': return 'text-blue-600 bg-blue-100';
      case 'rascunho': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrar</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-base focus:border-transparent"
                  value={filtros.texto}
                  onChange={(e) => setFiltros(prev => ({ ...prev, texto: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-base focus:border-transparent appearance-none"
                  value={filtros.status}
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <option value="todos">Todos os status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="vendido">Vendido</option>
                  <option value="rascunho">Rascunho</option>
                </select>
              </div>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => carregarProdutos(filtros)}
            >
              Aplicar filtro
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Seus produtos</h1>
          <p className="text-gray-600">Acesse gerencie a sua lista de produtos à venda</p>
        </div>

        {carregando ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCardProduto key={index} />
              ))}
            </div>
          ) : (
            <SkeletonListaProdutos />
          )
        ) : erro ? (
          <div className="bg-white rounded-xl p-6 border border-red-200">
            <div className="flex">
              <Package className="h-5 w-5 text-red-600" />
              <div className="ml-3">
                <h3 className="text-red-800 font-medium">Erro ao carregar produtos</h3>
                <p className="text-red-600">{erro}</p>
              </div>
            </div>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-gray-500">
              {filtros.texto || filtros.status !== 'todos' || filtros.categoria
                ? 'Tente ajustar os filtros para encontrar seus produtos.'
                : 'Comece criando seu primeiro produto.'}
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                size="md"
                icon="plus"
                onClick={handleNovoProduto}
              >
                Novo Produto
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {produtos.length} produto{produtos.length !== 1 ? 's' : ''} encontrado{produtos.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  icon="grid"
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  icon="list"
                  onClick={() => setViewMode('list')}
                />
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {produtos.map((produto) => (
                  <CardProduto
                    key={produto.id}
                    id={produto.id}
                    nome={produto.titulo}
                    descricao={produto.descricao}
                    preco={produto.preco}
                    status={produto.status}
                    imagemUrl={produto.imagem_url}
                    categoria={produto.categoria}
                    aoEditar={handleEditarProduto}
                    aoExcluir={handleExcluirProduto}
                    aoVisualizar={handleVerProduto}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="divide-y divide-gray-200">
                  {produtos.map((produto) => (
                    <div key={produto.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 h-16 w-16">
                            {produto.imagem_url ? (                           
                              <Image
                                className="h-16 w-16 rounded-lg object-cover"
                                src={produto.imagem_url}
                                alt={produto.titulo}
                                width={64}
                                height={64}
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg font-medium text-gray-900">
                                  {produto.titulo}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {produto.descricao}
                                </p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-lg font-semibold text-orange-base">
                                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${obterCorStatus(produto.status)}`}>
                                  {produto.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon="edit"
                            onClick={() => handleEditarProduto(produto.id)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            icon="trash"
                            onClick={() => handleExcluirProduto(produto.id)}
                            className="text-red-600 hover:bg-red-50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {produtos.length > 0 && totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={paginaAtual}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {modalAberto && produtoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Detalhes do Produto
              </h2>
              <button
                onClick={fecharModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                {produtoSelecionado.imagem_url ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={produtoSelecionado.imagem_url}
                      alt={produtoSelecionado.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {produtoSelecionado.titulo}
                    </h3>
                    <p className="text-3xl font-bold text-orange-base">
                      R$ {produtoSelecionado.preco.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${obterCorStatus(produtoSelecionado.status)}`}>
                    {produtoSelecionado.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Descrição</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {produtoSelecionado.descricao}
                  </p>
                </div>

                {produtoSelecionado.categoria && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Categoria</h4>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {produtoSelecionado.categoria}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Data de Criação</h4>
                    <p className="text-gray-600">
                      {formatarData(produtoSelecionado.data_criacao)}
                    </p>
                  </div>
                  {produtoSelecionado.data_atualizacao && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Última Atualização</h4>
                      <p className="text-gray-600">
                        {formatarData(produtoSelecionado.data_atualizacao)}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">ID do Produto</h4>
                  <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-2 rounded">
                    {produtoSelecionado.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                variant="outline"
                size="md"
                onClick={fecharModal}
              >
                Fechar
              </Button>
              <Button
                variant="outline"
                size="md"
                icon="edit"
                onClick={() => {
                  fecharModal();
                  handleEditarProduto(produtoSelecionado.id);
                }}
              >
                Editar
              </Button>
              <Button
                variant="primary"
                size="md"
                icon="trash"
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                    fecharModal();
                    handleExcluirProduto(produtoSelecionado.id);
                  }
                }}
                className="text-white bg-red-600 hover:bg-red-700"
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
