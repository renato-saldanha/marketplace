'use client';

import { useState } from 'react';
import { Search, X, SlidersHorizontal, Calendar, DollarSign } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { FiltrosProduto, StatusProduto } from '@/types';

interface AdvancedSearchProps {
  onSearch: (filtros: FiltrosProduto) => void;
  categorias?: string[];
  className?: string;
}

export default function AdvancedSearch({ onSearch, categorias = [], className = '' }: AdvancedSearchProps) {
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosProduto>({
    texto: '',
    status: 'todos',
    categoria: '',
    limite: 12,
    offset: 0
  });
  const [precoMin, setPrecoMin] = useState<string>('');
  const [precoMax, setPrecoMax] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');

  const status_opcoes = [
    { value: 'todos', label: 'Todos os Status' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'rascunho', label: 'Rascunho' }
  ];

  const categorias_opcoes = [
    { value: '', label: 'Todas as Categorias' },
    ...categorias.map(cat => ({ value: cat, label: cat }))
  ];

  const handleChange = (campo: keyof FiltrosProduto, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleBuscar = () => {
    const filtrosCompletos = {
      ...filtros,
      preco_min: precoMin ? parseFloat(precoMin) : undefined,
      preco_max: precoMax ? parseFloat(precoMax) : undefined,
      data_inicio: dataInicio || undefined,
      data_fim: dataFim || undefined,
    };
    onSearch(filtrosCompletos);
  };

  const handleLimparFiltros = () => {
    setFiltros({
      texto: '',
      status: 'todos',
      categoria: '',
      limite: 12,
      offset: 0
    });
    setPrecoMin('');
    setPrecoMax('');
    setDataInicio('');
    setDataFim('');
    onSearch({
      texto: '',
      status: 'todos',
      categoria: '',
      limite: 12,
      offset: 0
    });
  };

  const temFiltrosAtivos = () => {
    return (
      filtros.texto !== '' ||
      filtros.status !== 'todos' ||
      filtros.categoria !== '' ||
      precoMin !== '' ||
      precoMax !== '' ||
      dataInicio !== '' ||
      dataFim !== ''
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Busca Rápida */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-200" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={filtros.texto}
            onChange={(e) => handleChange('texto', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
            className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-lg focus:border-orange-base focus:outline-none"
          />
        </div>
        
        <Button
          variant={mostrarFiltrosAvancados ? 'primary' : 'outline'}
          size="md"
          onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>

        <Button
          variant="primary"
          size="md"
          icon="search"
          onClick={handleBuscar}
        >
          Buscar
        </Button>

        {temFiltrosAtivos() && (
          <Button
            variant="outline"
            size="md"
            icon="x"
            onClick={handleLimparFiltros}
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros Avançados */}
      {mostrarFiltrosAvancados && (
        <div className="card-base p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="title-sm text-gray-400">Filtros Avançados</h3>
            <button
              onClick={() => setMostrarFiltrosAvancados(false)}
              className="text-gray-200 hover:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="label-md text-gray-300 mb-2 block">Status</label>
              <select
                value={filtros.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full border border-gray-100 rounded-lg px-4 py-3 bg-white focus:border-orange-base focus:outline-none"
              >
                {status_opcoes.map(opcao => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            <div>
              <label className="label-md text-gray-300 mb-2 block">Categoria</label>
              <select
                value={filtros.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                className="w-full border border-gray-100 rounded-lg px-4 py-3 bg-white focus:border-orange-base focus:outline-none"
              >
                {categorias_opcoes.map(opcao => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="label-md text-gray-300 mb-2 block">Ordenar Por</label>
              <select
                className="w-full border border-gray-100 rounded-lg px-4 py-3 bg-white focus:border-orange-base focus:outline-none"
              >
                <option value="recentes">Mais Recentes</option>
                <option value="antigos">Mais Antigos</option>
                <option value="preco_asc">Menor Preço</option>
                <option value="preco_desc">Maior Preço</option>
                <option value="nome_asc">Nome (A-Z)</option>
                <option value="nome_desc">Nome (Z-A)</option>
              </select>
            </div>

            {/* Preço Mínimo */}
            <div>
              <label className="label-md text-gray-300 mb-2 block">Preço Mínimo</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-200" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={precoMin}
                  onChange={(e) => setPrecoMin(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-lg focus:border-orange-base focus:outline-none"
                />
              </div>
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="label-md text-gray-300 mb-2 block">Preço Máximo</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-200" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-lg focus:border-orange-base focus:outline-none"
                />
              </div>
            </div>

            {/* Data Início */}
            <div>
              <label className="label-md text-gray-300 mb-2 block">Data Início</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-200" />
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-lg focus:border-orange-base focus:outline-none"
                />
              </div>
            </div>

            {/* Data Fim */}
            <div>
              <label className="label-md text-gray-300 mb-2 block">Data Fim</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-200" />
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-lg focus:border-orange-base focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Resultados Encontrados */}
          {temFiltrosAtivos() && (
            <div className="pt-4 border-t border-gray-100">
              <p className="body-sm text-gray-200 text-center">
                Filtros ativos: {[
                  filtros.texto && 'Busca',
                  filtros.status !== 'todos' && 'Status',
                  filtros.categoria && 'Categoria',
                  precoMin && 'Preço Mín.',
                  precoMax && 'Preço Máx.',
                  dataInicio && 'Data Início',
                  dataFim && 'Data Fim'
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
