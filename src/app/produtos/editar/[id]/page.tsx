'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProdutos } from '@/lib/hooks/useApi';
import { obter_url_imagem_completa } from '@/lib/utils';
import ProtecaoRota from '@/components/ProtecaoRota';
import PageHeader from '@/components/PageHeader';
import FormularioProduto from '@/components/FormularioProduto';

const categorias_disponiveis = [
  { value: 'Eletrônicos', label: 'Eletrônicos' },
  { value: 'Informática', label: 'Informática' },
  { value: 'Móveis', label: 'Móveis' },
  { value: 'Roupas', label: 'Roupas' },
  { value: 'Acessórios', label: 'Acessórios' },
  { value: 'Casa e Jardim', label: 'Casa e Jardim' },
  { value: 'Esportes', label: 'Esportes' },
  { value: 'Livros', label: 'Livros' },
  { value: 'Beleza', label: 'Beleza' },
  { value: 'Outros', label: 'Outros' }
];

interface DadosProduto {
  nome: string;
  descricao: string;
  preco: string;
  categoria: string;
  status: string;
  imagem: File | null;
  imagemUrl?: string;
}

export default function PaginaEditarProduto() {
  const [dadosProduto, setDadosProduto] = useState<DadosProduto>({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    status: 'ativo',
    imagem: null,
    imagemUrl: ''
  });
  const [previewImagem, setPreviewImagem] = useState<string>('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [produtoCarregado, setProdutoCarregado] = useState(false);
  const router = useRouter();
  const params = useParams();
  const produtoId = params?.id as string;
  
  const { carregando, obterProduto, atualizarProduto } = useProdutos();

  useEffect(() => {
    const carregarProduto = async () => {
      if (produtoId && !produtoCarregado) {
        try {
          const produto = await obterProduto(produtoId);
          if (produto) {
            setDadosProduto({
              nome: produto.titulo || '',
              descricao: produto.descricao || '',
              preco: produto.preco ? produto.preco.toString() : '',
              categoria: produto.categoria || '',
              status: produto.status || 'ativo',
              imagem: null,
              imagemUrl: produto.imagem_url || ''
            });
            if (produto.imagem_url) {
              setPreviewImagem(obter_url_imagem_completa(produto.imagem_url) || '');
            }
            setProdutoCarregado(true);
          }
        } catch (error) {
          console.error('Erro ao carregar produto:', error);
        }
      }
    };

    carregarProduto();
  }, [produtoId, produtoCarregado, obterProduto]);

  const handleChange = (campo: keyof DadosProduto, valor: string | File | null) => {
    setDadosProduto(prev => ({
      ...prev,
      [campo]: valor
    }));

    if (erros[campo]) {
      setErros(prev => ({
        ...prev,
        [campo]: ''
      }));
    }
  };

  const handleUploadImagem = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    if (arquivo) {
      if (!arquivo.type.startsWith('image/')) {
        setErros(prev => ({
          ...prev,
          imagem: 'Por favor, selecione apenas arquivos de imagem'
        }));
        return;
      }

      if (arquivo.size > 5 * 1024 * 1024) {
        setErros(prev => ({
          ...prev,
          imagem: 'A imagem deve ter no máximo 5MB'
        }));
        return;
      }

      handleChange('imagem', arquivo);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImagem(result);
        // Atualizar imagemUrl para marcar que há uma nova imagem
        handleChange('imagemUrl', result);
      };
      reader.readAsDataURL(arquivo);
    }
  };

  const removerImagem = () => {
    handleChange('imagem', null);
    handleChange('imagemUrl', '');
    setPreviewImagem('');
  };

  const converterImagemParaBase64 = (arquivo: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(arquivo);
    });
  };

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!dadosProduto.nome.trim()) {
      novosErros.nome = 'O nome é obrigatório';
    } else if (dadosProduto.nome.length < 3) {
      novosErros.nome = 'O nome deve ter pelo menos 3 caracteres';
    }

    if (!dadosProduto.descricao.trim()) {
      novosErros.descricao = 'A descrição é obrigatória';
    } else if (dadosProduto.descricao.length < 10) {
      novosErros.descricao = 'A descrição deve ter pelo menos 10 caracteres';
    }

    const preco = parseFloat(dadosProduto.preco);
    if (!dadosProduto.preco || isNaN(preco)) {
      novosErros.preco = 'O preço é obrigatório';
    } else if (preco <= 0) {
      novosErros.preco = 'O preço deve ser maior que zero';
    }

    if (!dadosProduto.categoria) {
      novosErros.categoria = 'A categoria é obrigatória';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      let imagemBase64: string | undefined;
      
      if (dadosProduto.imagem) {
        try {
          imagemBase64 = await converterImagemParaBase64(dadosProduto.imagem);
        } catch (error) {
          console.error('Erro ao converter imagem:', error);
          setErros({ imagem: 'Erro ao processar imagem' });
          return;
        }
      }

      await atualizarProduto(produtoId, {
        titulo: dadosProduto.nome,
        descricao: dadosProduto.descricao,
        preco: parseFloat(dadosProduto.preco),
        categoria: dadosProduto.categoria,
        status: dadosProduto.status as any,
        imagem_data: imagemBase64,
      });

      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };


  const handleVoltar = () => {
    router.push('/produtos');
  };

  const handleMarcarVendido = async () => {
    try {
      await atualizarProduto(produtoId, {
        status: 'vendido' as any,
      });
      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao marcar como vendido:', error);
    }
  };

  const handleDesativar = async () => {
    try {
      await atualizarProduto(produtoId, {
        status: dadosProduto.status === 'ativo' ? 'inativo' as any : 'ativo' as any,
      });
      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao desativar produto:', error);
    }
  };

  if (carregando && !produtoCarregado) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-base mb-4"></div>
          <p className="body-md text-gray-300">Carregando produto...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtecaoRota>
      <div className="min-h-screen bg-background">
        <PageHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header da página */}
          <div className="mb-8">
            
            <h1 className="title-lg text-gray-400 mb-2">Editar produto</h1>
            <p className="body-md text-gray-200">Gerencie as informações do produto cadastrado</p>
          </div>

          {/* Formulário */}
          <FormularioProduto
            dadosProduto={dadosProduto}
            previewImagem={previewImagem}
            erros={erros}
            carregandoImagem={false}
            carregando={carregando}
            opcoesCategorias={categorias_disponiveis}
            statusOpcoes={[]}
            onChange={handleChange}
            onUploadImagem={handleUploadImagem}
            onRemoverImagem={removerImagem}
            onSubmit={handleSubmit}
            onVoltar={handleVoltar}
            onMarcarVendido={handleMarcarVendido}
            onDesativar={handleDesativar}
            modoEdicao={true}
          />
        </main>
      </div>
    </ProtecaoRota>
  );
}
