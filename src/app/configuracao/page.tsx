'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Bell, Globe, Moon, Sun, 
  Shield,  Lock, Trash2,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import ProtecaoRota from '@/components/ProtecaoRota';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/ui/Button';
import { useConfiguracao } from '@/lib/hooks/useConfiguracao';
import { useAutenticacao } from '@/lib/hooks/useApi';

interface ConfiguracoesLocais {
  notificacoes_email: boolean;
  notificacoes_push: boolean;
  notificacoes_vendas: boolean;
  notificacoes_mensagens: boolean;
  notificacoes_promocoes: boolean;
  
  tema_preferido: 'claro' | 'escuro' | 'auto';
  idioma_preferido: string;
  
  perfil_publico: boolean;
  mostrar_contato: boolean;
  mostrar_email: boolean;
  compartilhar_analytics: boolean;
  receber_newsletter: boolean;
}

export default function PaginaConfiguracoes() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesLocais>({
    notificacoes_email: true,
    notificacoes_push: true,
    notificacoes_vendas: true,
    notificacoes_mensagens: true,
    notificacoes_promocoes: true,
    tema_preferido: 'auto',
    idioma_preferido: 'pt-BR',
    perfil_publico: false,
    mostrar_contato: true,
    mostrar_email: false,
    compartilhar_analytics: true,
    receber_newsletter: false,
  });
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  
  const router = useRouter();
  const toast = useToast();
  const { 
    configuracao: configuracaoAPI, 
    carregando, 
    atualizarConfiguracao 
  } = useConfiguracao();
  const { excluirConta } = useAutenticacao();

  // Carregar configurações da API quando disponíveis
  useEffect(() => {
    if (configuracaoAPI) {
      setConfiguracoes({
        notificacoes_email: configuracaoAPI.notificacoes_email,
        notificacoes_push: configuracaoAPI.notificacoes_push,
        notificacoes_vendas: configuracaoAPI.notificacoes_vendas,
        notificacoes_mensagens: configuracaoAPI.notificacoes_mensagens,
        notificacoes_promocoes: configuracaoAPI.notificacoes_promocoes,
        tema_preferido: configuracaoAPI.tema_preferido as 'claro' | 'escuro' | 'auto',
        idioma_preferido: configuracaoAPI.idioma_preferido,
        perfil_publico: configuracaoAPI.perfil_publico,
        mostrar_contato: configuracaoAPI.mostrar_contato,
        mostrar_email: configuracaoAPI.mostrar_email,
        compartilhar_analytics: configuracaoAPI.compartilhar_analytics,
        receber_newsletter: configuracaoAPI.receber_newsletter,
      });
    }
  }, [configuracaoAPI]);

  const handleToggle = (campo: keyof ConfiguracoesLocais) => {
    setConfiguracoes(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const handleChange = (campo: keyof ConfiguracoesLocais, valor: string) => {
    setConfiguracoes(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSalvar = async () => {
    try {
      await atualizarConfiguracao(configuracoes);
      toast.success('Configurações salvas!', 'Suas preferências foram atualizadas');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar', 'Tente novamente em alguns instantes');
    }
  };

  const handleExcluirConta = async () => {
    try {
      await excluirConta();
      toast.success('Conta excluída', 'Sua conta foi removida permanentemente');
      router.push('/login');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      toast.error('Erro ao excluir conta', 'Tente novamente em alguns instantes');
    } finally {
      setMostrarModalExclusao(false);
    }
  };

  const handleExportarDados = async () => {
    toast.info('Preparando exportação', 'Seus dados serão baixados em breve');
    
    try {
      // TODO: Implementar chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Dados exportados!', 'O download começará em instantes');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro na exportação', 'Tente novamente em alguns instantes');
    }
  };

  return (
    <ProtecaoRota>
      <div className="min-h-screen bg-background">
        <PageHeader/>

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
              <h1 className="title-lg text-gray-400 mb-2">Configurações</h1>
              <p className="body-md text-gray-200">Personalize sua experiência no marketplace</p>
            </div>
          </div>

          {/* Seções de Configurações */}
          <div className="space-y-6">
            {/* Notificações */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-light rounded-lg">
                  <Bell className="h-5 w-5 text-blue-base" />
                </div>
                <div>
                  <h2 className="title-sm text-gray-400">Notificações</h2>
                  <p className="body-sm text-gray-200">Gerencie como você recebe notificações</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="body-md text-gray-400">Notificações por Email</p>
                    <p className="body-sm text-gray-200">Receba atualizações por email</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notificacoes_email')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      configuracoes.notificacoes_email ? 'bg-orange-base' : 'bg-gray-100'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        configuracoes.notificacoes_email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="body-md text-gray-400">Notificações Push</p>
                    <p className="body-sm text-gray-200">Receba notificações no navegador</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notificacoes_push')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      configuracoes.notificacoes_push ? 'bg-orange-base' : 'bg-gray-100'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        configuracoes.notificacoes_push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="body-md text-gray-400">Alertas de Vendas</p>
                    <p className="body-sm text-gray-200">Notificar sobre novas vendas</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notificacoes_vendas')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      configuracoes.notificacoes_vendas ? 'bg-orange-base' : 'bg-gray-100'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        configuracoes.notificacoes_vendas ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="body-md text-gray-400">Atualizações de Produtos</p>
                    <p className="body-sm text-gray-200">Notificar sobre mudanças nos produtos</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notificacoes_mensagens')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      configuracoes.notificacoes_mensagens ? 'bg-orange-base' : 'bg-gray-100'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        configuracoes.notificacoes_mensagens ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Aparência */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-base/10 rounded-lg">
                  <Sun className="h-5 w-5 text-orange-base" />
                </div>
                <div>
                  <h2 className="title-sm text-gray-400">Aparência</h2>
                  <p className="body-sm text-gray-200">Personalize a interface do sistema</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="body-md text-gray-400 mb-3 block">Tema</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['claro', 'escuro', 'auto'].map((tema) => (
                      <button
                        key={tema}
                        onClick={() => handleChange('tema_preferido', tema)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          configuracoes.tema_preferido === tema
                            ? 'border-orange-base bg-orange-base/5'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {tema === 'claro' && <Sun className="h-5 w-5" />}
                          {tema === 'escuro' && <Moon className="h-5 w-5" />}
                          {tema === 'auto' && <Globe className="h-5 w-5" />}
                          <span className="body-sm capitalize">{tema}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="body-md text-gray-400 mb-3 block">Idioma</label>
                  <select
                    value={configuracoes.idioma_preferido}
                    onChange={(e) => handleChange('idioma_preferido', e.target.value)}
                    className="w-full border border-gray-100 rounded-lg px-4 py-3 bg-white focus:border-orange-base focus:outline-none"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacidade */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-shape rounded-lg">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h2 className="title-sm text-gray-400">Privacidade</h2>
                  <p className="body-sm text-gray-200">Controle suas informações pessoais</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="body-md text-gray-400">Perfil Público</p>
                    <p className="body-sm text-gray-200">Permitir que outros vejam seu perfil</p>
                  </div>
                  <button
                    onClick={() => handleToggle('perfil_publico')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      configuracoes.perfil_publico ? 'bg-orange-base' : 'bg-gray-100'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        configuracoes.perfil_publico ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="body-md text-gray-400">Mostrar Email</p>
                    <p className="body-sm text-gray-200">Exibir email no perfil público</p>
                  </div>
                  <button
                    onClick={() => handleToggle('mostrar_email')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      configuracoes.mostrar_email ? 'bg-orange-base' : 'bg-gray-100'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        configuracoes.mostrar_email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Lock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h2 className="title-sm text-gray-400">Segurança</h2>
                  <p className="body-sm text-gray-200">Proteja sua conta</p>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="md"
                  icon="lock"
                  className="w-full"
                  onClick={() => router.push('/profile')}
                >
                  Alterar Senha
                </Button>
              </div>
            </div>

            {/* Dados e Conta */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-danger/10 rounded-lg">
                  <Trash2 className="h-5 w-5 text-danger" />
                </div>
                <div>
                  <h2 className="title-sm text-gray-400">Dados e Conta</h2>
                  <p className="body-sm text-gray-200">Gerencie seus dados pessoais</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="md"
                  icon="download"
                  className="w-full"
                  onClick={handleExportarDados}
                >
                  Exportar Meus Dados
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-danger border-danger hover:bg-danger/10"
                  onClick={() => setMostrarModalExclusao(true)}
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Excluir Minha Conta
                </Button>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/')}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="lg"
                icon="save"
                loading={carregando}
                onClick={handleSalvar}
              >
                Salvar Configurações
              </Button>
            </div>
          </div>
        </main>

        {/* Modal de Confirmação de Exclusão */}
        {mostrarModalExclusao && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card-base p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-8 w-8 text-danger" />
                </div>
                <h2 className="title-md text-gray-400 mb-2">Excluir Conta</h2>
                <p className="body-md text-gray-200">
                  Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão permanentemente removidos.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setMostrarModalExclusao(false)}
                  disabled={carregando}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-danger hover:bg-danger/90"
                  loading={carregando}
                  onClick={handleExcluirConta}
                >
                  Confirmar Exclusão
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtecaoRota>
  );
}
