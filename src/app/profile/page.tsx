'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Calendar, Edit, Save, X, Camera } from 'lucide-react';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import ProtecaoRota from '@/components/ProtecaoRota';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ModalAlterarSenha from '@/components/ui/ModalAlterarSenha';

interface DadosUsuario {
  nome: string;
  email: string;
  telefone: string;
  dataCriacao: string;
}

export default function PaginaPerfil() {
  const [dadosUsuario, setDadosUsuario] = useState<DadosUsuario>({
    nome: '',
    email: '',
    telefone: '',
    dataCriacao: ''
  });
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [modalAlterarSenhaAberto, setModalAlterarSenhaAberto] = useState(false);
  
  const router = useRouter();
  const toast = useToast();
  const { usuario, fazerLogout, atualizarPerfil, alterarSenha } = useAutenticacao();

  useEffect(() => {
    if (usuario) {
      setDadosUsuario({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: '', // TODO: Adicionar telefone ao modelo de usuário
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      });
    }
  }, [usuario]);

  const handleChange = (campo: keyof DadosUsuario, valor: string) => {
    setDadosUsuario(prev => ({
      ...prev,
      [campo]: valor
    }));

    // Limpar erro do campo
    if (erros[campo]) {
      setErros(prev => ({
        ...prev,
        [campo]: ''
      }));
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!dadosUsuario.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (dadosUsuario.nome.length < 2) {
      novosErros.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!dadosUsuario.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(dadosUsuario.email)) {
      novosErros.email = 'Email inválido';
    }

    if (dadosUsuario.telefone && dadosUsuario.telefone.length < 10) {
      novosErros.telefone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    
    try {
      // Chamar API de atualização de perfil
      await atualizarPerfil({
        nome: dadosUsuario.nome
      });
      
      setEditando(false);
      toast.success('Perfil atualizado!', 'Suas informações foram salvas com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil', 'Tente novamente em alguns instantes');
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = () => {
    if (usuario) {
      setDadosUsuario({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: '',
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      });
    }
    setEditando(false);
    setErros({});
  };

  const handleLogout = () => {
    fazerLogout();
    toast.info('Logout realizado', 'Você foi desconectado com sucesso');
    router.push('/login');
  };

  const handleAlterarSenha = async (dados: { senha_atual: string; nova_senha: string }) => {
    try {
      await alterarSenha(dados);
      toast.success('Senha alterada!', 'Sua senha foi atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha', 'Verifique os dados e tente novamente');
    }
  };

  return (
    <ProtecaoRota>
      <div className="min-h-screen bg-background">
        <PageHeader />

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Header da página */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="rotate-180"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="title-lg text-gray-400 mb-2">Meu Perfil</h1>
              <p className="body-md text-gray-200">Gerencie suas informações pessoais</p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card de Avatar */}
            <div className="lg:col-span-1">
              <div className="card-base p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-shape rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12 text-gray-200" />
                  </div>
                  {editando && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-orange-base text-white rounded-full flex items-center justify-center hover:bg-orange-dark transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h3 className="title-sm text-gray-400 mb-2">{dadosUsuario.nome}</h3>
                <p className="body-sm text-gray-200 mb-4">{dadosUsuario.email}</p>
                
                <div className="flex items-center justify-center gap-2 text-body-xs text-gray-200">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {dadosUsuario.dataCriacao}</span>
                </div>
              </div>
            </div>

            {/* Formulário de Informações */}
            <div className="lg:col-span-2">
              <div className="card-base p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="title-sm text-gray-400">Informações Pessoais</h2>
                  {!editando ? (
                    <Button
                      variant="outline"
                      size="sm"
                      icon="edit"
                      onClick={() => setEditando(true)}
                    >
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon="x"
                        onClick={handleCancelar}
                        disabled={carregando}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon="save"
                        onClick={handleSalvar}
                        loading={carregando}
                        disabled={carregando}
                      >
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <Input
                    label="Nome Completo"
                    placeholder="Digite seu nome completo"
                    icon="user"
                    value={dadosUsuario.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    error={erros.nome}
                    disabled={!editando}
                  />

                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    icon="mail"
                    value={dadosUsuario.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={erros.email}
                    disabled={!editando}
                  />

                  <Input
                    label="Telefone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    icon="phone"
                    value={dadosUsuario.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    error={erros.telefone}
                    disabled={!editando}
                  />
                </div>
              </div>

              {/* Estatísticas */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card-base p-4 text-center">
                  <div className="text-2xl font-bold text-orange-base mb-1">12</div>
                  <div className="body-sm text-gray-200">Produtos Ativos</div>
                </div>
                
                <div className="card-base p-4 text-center">
                  <div className="text-2xl font-bold text-blue-base mb-1">8</div>
                  <div className="body-sm text-gray-200">Produtos Vendidos</div>
                </div>
                
                <div className="card-base p-4 text-center">
                  <div className="text-2xl font-bold text-success mb-1">R$ 2.450</div>
                  <div className="body-sm text-gray-200">Total em Vendas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Adicionais */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-base p-6">
              <h3 className="title-sm text-gray-400 mb-4">Segurança da Conta</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="body-md text-gray-400">Alterar Senha</p>
                    <p className="body-sm text-gray-200">Atualize sua senha de acesso</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setModalAlterarSenhaAberto(true)}
                  >
                    Alterar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="body-md text-gray-400">Autenticação em 2 Etapas</p>
                    <p className="body-sm text-gray-200">Adicione uma camada extra de segurança</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ativar
                  </Button>
                </div>
              </div>
            </div>

            <div className="card-base p-6">
              <h3 className="title-sm text-gray-400 mb-4">Configurações</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="body-md text-gray-400">Notificações</p>
                    <p className="body-sm text-gray-200">Gerencie suas preferências</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="body-md text-gray-400">Privacidade</p>
                    <p className="body-sm text-gray-200">Controle seus dados pessoais</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Gerenciar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modal Alterar Senha */}
        <ModalAlterarSenha
          aberto={modalAlterarSenhaAberto}
          onFechar={() => setModalAlterarSenhaAberto(false)}
          onAlterarSenha={handleAlterarSenha}
        />
      </div>
    </ProtecaoRota>
  );
}
