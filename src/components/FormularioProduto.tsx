'use client';

import { useRef } from 'react';
import { Upload, X, Check, CircleX } from 'lucide-react';
import Image from 'next/image';
import Button from './ui/Button';

interface DadosProduto {
  nome: string;
  descricao: string;
  preco: string;
  categoria: string;
  status: string;
  imagem: File | null;
  imagemUrl?: string;
}

interface PropsFormularioProduto {
  dadosProduto: DadosProduto;
  previewImagem: string;
  erros: Record<string, string>;
  carregandoImagem: boolean;
  carregando: boolean;
  opcoesCategorias: Array<{ value: string; label: string }>;
  statusOpcoes: Array<{ value: string; label: string }>;
  onChange: (campo: keyof DadosProduto, valor: string | File | null) => void;
  onUploadImagem: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoverImagem: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onVoltar: () => void;
  onMarcarVendido?: () => void;
  onDesativar?: () => void;
  modoEdicao?: boolean;
}

export default function FormularioProduto({
  dadosProduto,
  previewImagem,
  erros,
  carregandoImagem,
  carregando,
  opcoesCategorias,
  onChange,
  onUploadImagem,
  onRemoverImagem,
  onSubmit,
  onVoltar,
  onMarcarVendido,
  onDesativar,
  modoEdicao = false
}: PropsFormularioProduto) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-blue-500 text-white';
      case 'inativo': return 'bg-gray-500 text-white';
      case 'vendido': return 'bg-green-500 text-white';
      case 'rascunho': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const obterTextoStatus = (status: string) => {
    switch (status) {
      case 'ativo': return 'ANUNCIADO';
      case 'inativo': return 'INATIVO';
      case 'vendido': return 'VENDIDO';
      case 'rascunho': return 'RASCUNHO';
      default: return status.toUpperCase();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-end mt-8 pt-8 border-white my-2">
        <div className="flex items-center gap-4">
          {modoEdicao && onMarcarVendido && dadosProduto.status === 'ativo' && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onMarcarVendido}
              className="text-orange-500 border-orange-500 hover:bg-orange-50"
            >
              <Check className="h-4 w-4 mr-2" />
              Marcar como vendido
            </Button>
          )}
          {modoEdicao && onDesativar && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onDesativar}
              className="text-orange-500 border-orange-500 hover:bg-orange-50"
            >
              {dadosProduto.status === 'ativo' ? <CircleX className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              {dadosProduto.status === 'ativo' ? 'Desativar anúncio' : 'Ativar anúncio'}  
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Upload de Imagem */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-blue-100 bg-gray-50 rounded-lg p-12 text-center">
              {!previewImagem ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onUploadImagem}
                    className="hidden"
                    id="upload-imagem"
                  />
                  <label htmlFor="upload-imagem" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                        {carregandoImagem ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : (
                          <Upload className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <p className="text-gray-600 font-medium">
                        {carregandoImagem ? 'Processando imagem...' : 'Selecione a imagem do produto'}
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    width={256}
                    height={256}
                    src={previewImagem}
                    alt="Preview da imagem do produto"
                    className="w-full h-64 object-cover rounded-lg"
                    style={{ width: "auto", height: "auto" }}
                  />
                  <button
                    type="button"
                    onClick={onRemoverImagem}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {erros.imagem && (
                <p className="text-red-500 text-sm mt-2">{erros.imagem}</p>
              )}
            </div>
          </div>

          {/* Coluna Direita - Dados do Produto */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">Dados do produto</h2>
              {modoEdicao && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${obterCorStatus(dadosProduto.status)}`}>
                  {obterTextoStatus(dadosProduto.status)}
                </span>
              )}
            </div>

            {/* Título e Valor na mesma linha */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                  TÍTULO
                </label>
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={dadosProduto.nome}
                  onChange={(e) => onChange('nome', e.target.value)}
                  className={`w-full px-3 py-2 border-b ${erros.nome ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none bg-transparent`}
                  required
                />
                {erros.nome && (
                  <p className="text-red-500 text-sm mt-1">{erros.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                  VALOR
                </label>
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={dadosProduto.preco}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
                    onChange('preco', valor);
                  }}
                  className={`w-full px-3 py-2 border-b ${erros.preco ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none bg-transparent`}
                  required
                />
                {erros.preco && (
                  <p className="text-red-500 text-sm mt-1">{erros.preco}</p>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                DESCRIÇÃO
              </label>
              <textarea
                placeholder="Escreva detalhes sobre o produto, tamanho, características"
                value={dadosProduto.descricao}
                onChange={(e) => onChange('descricao', e.target.value)}
                className={`w-full px-3 py-2 border-b ${erros.descricao ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none bg-transparent min-h-[100px] resize-none`}
                required
              />
              {erros.descricao && (
                <p className="text-red-500 text-sm mt-1">{erros.descricao}</p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                CATEGORIA
              </label>
              <select
                value={dadosProduto.categoria}
                onChange={(e) => onChange('categoria', e.target.value)}
                className={`w-full px-3 py-2 border-b ${erros.categoria ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none bg-transparent`}
                required
              >
                <option value="" disabled>Selecione uma categoria</option>
                {opcoesCategorias.map((categoria) => (
                  <option key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </option>
                ))}
              </select>
              {erros.categoria && (
                <p className="text-red-500 text-sm mt-1">{erros.categoria}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end mt-8 pt-8 border-white">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onVoltar}
              disabled={carregando}
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={carregando}
              loading={carregando}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {carregando ? 'Salvando...' : modoEdicao ? 'Salvar e atualizar' : 'Salvar e publicar'}
            </Button>
          </div>
        </div>
        
      </div>
    </form>
  );
}
