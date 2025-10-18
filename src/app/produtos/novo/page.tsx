'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DadosProduto as DadosProdutoAPI } from '@/types';
import { useProdutos, useCategorias } from '@/lib/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import ProtecaoRota from '@/components/ProtecaoRota';
import PageHeader from '@/components/PageHeader';
import FormularioProduto from '@/components/FormularioProduto';

const categorias_padrao = [
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

export default function PaginaNovoProduto() {
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
  const [carregando, setCarregando] = useState(false);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

  const { criarProduto } = useProdutos();
  const { categorias } = useCategorias();

  // Converter categorias do API (strings) para objetos com value e label
  const opcoes_categorias = categorias.length > 0 
    ? categorias.map(cat => ({ value: cat, label: cat }))
    : categorias_padrao;

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

  const handleUploadImagem = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setErros({ imagem: 'Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.' });
      return;
    }

    const tamanhoMaximo = 5 * 1024 * 1024;
    if (arquivo.size > tamanhoMaximo) {
      setErros({ imagem: 'Arquivo muito grande. Máximo 5MB.' });
      return;
    }

    setCarregandoImagem(true);
    setErros(prev => ({ ...prev, imagem: '' }));

    try {
      const urlTemporaria = URL.createObjectURL(arquivo);
      setPreviewImagem(urlTemporaria);
      
      setDadosProduto(prev => ({
        ...prev,
        imagem: arquivo,
        imagemUrl: urlTemporaria
      }));

      setErros(prev => ({ ...prev, imagem: '' }));
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      setErros({ imagem: 'Erro ao processar a imagem. Tente novamente.' });
    } finally {
      setCarregandoImagem(false);
    }
  };

  const removerImagem = () => {
    if (previewImagem) {
      if (previewImagem.startsWith('blob:')) {
        URL.revokeObjectURL(previewImagem);
      }
      setPreviewImagem('');
    }
    setDadosProduto(prev => ({
      ...prev,
      imagem: null,
      imagemUrl: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErros(prev => ({ ...prev, imagem: '' }));
  };

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!dadosProduto.nome.trim()) {
      novosErros.nome = 'O nome é obrigatório';
    } else if (dadosProduto.nome.trim().length < 3) {
      novosErros.nome = 'O nome deve ter pelo menos 3 caracteres';
    }

    if (!dadosProduto.descricao.trim()) {
      novosErros.descricao = 'A descrição é obrigatória';
    } else if (dadosProduto.descricao.trim().length < 10) {
      novosErros.descricao = 'A descrição deve ter pelo menos 10 caracteres';
    }

    if (!dadosProduto.preco.trim()) {
      novosErros.preco = 'O preço é obrigatório';
    } else {
      const precoNumero = parseFloat(dadosProduto.preco);
      if (isNaN(precoNumero) || precoNumero <= 0) {
        novosErros.preco = 'O preço deve ser um valor válido maior que zero';
      }
    }

    if (!dadosProduto.categoria) {
      novosErros.categoria = 'A categoria é obrigatória';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    try {
      let imagemBase64: string | undefined;
      
      if (dadosProduto.imagem) {
        try {
          imagemBase64 = await converterImagemParaBase64(dadosProduto.imagem);
        } catch (error) {
          console.error('Erro ao converter imagem:', error);
          toast.error('Erro ao processar imagem', 'Tente selecionar outra imagem');
          return;
        }
      }

      const dadosAPI: DadosProdutoAPI = {
        titulo: dadosProduto.nome,
        descricao: dadosProduto.descricao,
        preco: parseFloat(dadosProduto.preco),
        categoria: dadosProduto.categoria,
        status: dadosProduto.status as any,
        imagem_data: imagemBase64
      };

      await criarProduto(dadosAPI);

      toast.success('Produto criado com sucesso!', 'Seu produto foi adicionado ao marketplace');
      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast.error('Erro ao criar produto', 'Tente novamente em alguns instantes');
    } finally {
      setCarregando(false);
    }
  };

  const handleVoltar = () => {
    router.push('/produtos');
  };

  return (
    <ProtecaoRota>
      <div className="min-h-screen bg-background">
        <PageHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header da página */}
          <div className="mb-8">
            <h1 className="title-lg text-gray-400 mb-2">Novo produto</h1>
            <p className="body-md text-gray-200">Cadastre um produto para venda no marketplace</p>
          </div>

          {/* Formulário */}
          <FormularioProduto
            dadosProduto={dadosProduto}
            previewImagem={previewImagem}
            erros={erros}
            carregandoImagem={carregandoImagem}
            carregando={carregando}
            opcoesCategorias={opcoes_categorias}
            statusOpcoes={[]}
            onChange={handleChange}
            onUploadImagem={handleUploadImagem}
            onRemoverImagem={removerImagem}
            onSubmit={handleSubmit}
            onVoltar={handleVoltar}
            modoEdicao={false}
          />
        </main>
      </div>
    </ProtecaoRota>
  );
}