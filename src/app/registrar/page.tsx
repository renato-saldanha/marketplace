'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Camera, X } from 'lucide-react';
import { validar_email } from '@/lib/utils';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { servicoUpload } from '@/lib/servicos/upload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import MarketingBackground from '@/components/ui/MarketingBackground';

export default function PaginaRegistro() {
  const [dadosRegistro, setDadosRegistro] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const { carregando, erro, registrarUsuario, limparErro } = useAutenticacao();

  const handleMudanca = (campo: string, valor: string) => {
    setDadosRegistro(prev => ({
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

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    // Validar nome
    if (!dadosRegistro.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (dadosRegistro.nome.length < 2) {
      novosErros.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar email
    if (!dadosRegistro.email) {
      novosErros.email = 'Email é obrigatório';
    } else if (!validar_email(dadosRegistro.email)) {
      novosErros.email = 'Email inválido';
    }

    // Validar telefone
    if (!dadosRegistro.telefone) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (dadosRegistro.telefone.length < 10) {
      novosErros.telefone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    // Validar senha
    if (!dadosRegistro.senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (dadosRegistro.senha.length < 6) {
      novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validar confirmação de senha
    if (!dadosRegistro.confirmarSenha) {
      novosErros.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (dadosRegistro.senha !== dadosRegistro.confirmarSenha) {
      novosErros.confirmarSenha = 'Senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    limparErro();

    if (!validarFormulario()) {
      return;
    }
    
    const resultado = await registrarUsuario(
      dadosRegistro.nome,
      dadosRegistro.email,
      dadosRegistro.senha,
      undefined, // foto_perfil_url (não usado mais)
      fotoPerfil || undefined // foto_perfil_data (base64)
    );
    
    if (resultado) {
      router.push('/login?registrado=true');
    }
  };

  const irParaLogin = () => {
    router.push('/login');
  };

  const handleUploadFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setErros({ foto: 'Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.' });
      return;
    }

    const tamanhoMaximo = 5 * 1024 * 1024;
    if (arquivo.size > tamanhoMaximo) {
      setErros({ foto: 'Arquivo muito grande. Máximo 5MB.' });
      return;
    }

    setCarregandoFoto(true);
    setErros(prev => ({ ...prev, foto: '' }));

    try {
      const urlTemporaria = URL.createObjectURL(arquivo);
      setFotoPerfil(urlTemporaria);
      
      const base64Data = await servicoUpload.fazerUploadImagem(arquivo);
      setFotoPerfil(base64Data);
      URL.revokeObjectURL(urlTemporaria);
    } catch (error) {
      console.error('Erro ao carregar foto:', error);
      setErros({ foto: 'Erro ao carregar foto. Tente novamente.' });
      
      setFotoPerfil(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setCarregandoFoto(false);
    }
  };

  const removerFoto = () => {
    if (fotoPerfil) {
      if (fotoPerfil.startsWith('blob:')) {
        URL.revokeObjectURL(fotoPerfil);
      }
      setFotoPerfil(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErros(prev => ({ ...prev, foto: '' }));
  };

  const abrirSeletorArquivo = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex">
      {/* Lado Esquerdo - Design Visual */}
      <MarketingBackground/>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo para mobile */}
          <div className="lg:hidden text-center mb-8">
            <Logo size="lg" className="justify-center" />
          </div>

          {/* Título e subtítulo */}
          <div className="mb-8">
            <h1 className="title-md text-gray-500 mb-2">
              Crie sua conta
            </h1>
            <p className="body-md text-gray-200">
              Informe os seus dados pessoais e de acesso
            </p>
          </div>

          {/* Seção Perfil */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-500 mb-4">Perfil</h2>
            
            {/* Avatar com upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div 
                  className="w-20 h-20 bg-orange-base/20 rounded-lg flex items-center justify-center border-2 border-orange-base/30 cursor-pointer hover:bg-orange-base/30 transition-colors group"
                  onClick={abrirSeletorArquivo}
                >
                  {fotoPerfil ? (
                    <Image 
                      src={fotoPerfil.startsWith('data:') ? fotoPerfil : `data:image/png;base64,${fotoPerfil}`}
                      alt="Foto do perfil" 
                      className="w-full h-full rounded-lg object-cover"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <User className="w-10 h-10 text-orange-base group-hover:text-orange-base/80" />
                  )}
                  
                  {/* Overlay de upload */}
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Botão remover foto */}
                {fotoPerfil && (  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removerFoto();
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full flex items-center justify-center hover:bg-danger/80 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
                
                {/* Loading indicator */}
                {carregandoFoto && (
                  <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-orange-base border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-400 mt-2 text-center">
                {fotoPerfil ? 'Clique para alterar' : 'Clique para adicionar foto'}
              </p>
              
              {/* Erro da foto */}
              {erros.foto && (
                <p className="text-xs text-danger mt-1 text-center">{erros.foto}</p>
              )}
            </div>
            
            {/* Input file oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadFoto}
              className="hidden"
            />
          </div>

          {/* Mensagem de erro geral */}
          {(erros.geral || erro) && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
              <p className="body-sm text-danger">{erros.geral || erro}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção Perfil - Campos */}
            <Input
              label="NOME"
              type="text"
              placeholder="Seu nome completo"
              icon="user"
              value={dadosRegistro.nome}
              onChange={(e) => handleMudanca('nome', e.target.value)}
              error={erros.nome}
              required
            />

            <Input
              label="TELEFONE"
              type="tel"
              placeholder="(00) 00000-0000"
              icon="phone"
              value={dadosRegistro.telefone}
              onChange={(e) => handleMudanca('telefone', e.target.value)}
              error={erros.telefone}
              required
            />

            {/* Seção Acesso */}
            <div className="pt-4">
              <h2 className="text-lg font-medium text-gray-500 mb-4">Acesso</h2>
            </div>

            <Input
              label="E-MAIL"
              type="email"
              placeholder="Seu e-mail de acesso"
              icon="mail"
              value={dadosRegistro.email}
              onChange={(e) => handleMudanca('email', e.target.value)}
              error={erros.email}
              required
            />

            <div className="relative">
              <Input
                label="SENHA"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha de acesso"
                icon="lock"
                value={dadosRegistro.senha}
                onChange={(e) => handleMudanca('senha', e.target.value)}
                error={erros.senha}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >              
              </button>
            </div>

            <div className="relative">
              <Input
                label="CONFIRMAR SENHA"
                type={mostrarConfirmarSenha ? "text" : "password"}
                placeholder="Confirme a senha"
                icon="lock"
                value={dadosRegistro.confirmarSenha}
                onChange={(e) => handleMudanca('confirmarSenha', e.target.value)}
                error={erros.confirmarSenha}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon="arrow-right"
              className="w-full"
              disabled={carregando}
              loading={carregando}
            >
              {carregando ? 'Criando Conta...' : 'Cadastrar'}
            </Button>
          </form>

          {/* Link para login */}
          <div className="mt-8 pt-12  border-gray-100">
            <p className="body-md text-gray-300 text-center mb-4">
              Já tem uma conta?
            </p>
            <Button
              variant="secondary"
              size="lg"
              icon="arrow-right"
              className="w-full"
              onClick={irParaLogin}
            >
              Acessar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
