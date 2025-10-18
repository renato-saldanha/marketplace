'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validar_email } from '@/lib/utils';
import { useAutenticacao } from '@/lib/hooks/useApi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import MarketingBackground from '@/components/ui/MarketingBackground';

export default function PaginaLogin() {
  const [dados_login, set_dados_login] = useState({
    email: '',
    senha: ''
  });
  const [erros, set_erros] = useState<Record<string, string>>({});
  const router = useRouter();
  
  const { carregando, erro, fazerLogin, limparErro } = useAutenticacao();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    limparErro();
    set_erros({});

    const novos_erros: Record<string, string> = {};

    if (!dados_login.email) {
      novos_erros.email = 'Email é obrigatório';
    } else if (!validar_email(dados_login.email)) {
      novos_erros.email = 'Email inválido';
    }

    if (!dados_login.senha) {
      novos_erros.senha = 'Senha é obrigatória';
    }

    set_erros(novos_erros);

    if (Object.keys(novos_erros).length > 0) {
      return;
    }

    const resultado = await fazerLogin(dados_login.email, dados_login.senha);
    
    if (resultado) {      
      router.push('/');
    }
  };

  const handleMudanca = (campo: string, valor: string) => {
    set_dados_login(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    if (erros[campo]) {
      set_erros(prev => ({
        ...prev,
        [campo]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex">
      {/* Lado Esquerdo - Visual/Ilustrativo */}
      <MarketingBackground />

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 mx-3 my-6 rounded-lg border border-white bg-white">
        <div className="w-full max-w-md">
          {/* Logo para mobile */}
          <div className="lg:hidden text-center mb-8">
            <Logo size="lg" className="justify-center" />
          </div>

          {/* Formulário de Login */}
          <div>
            <h1 className="title-md text-gray-500 mb-2">
              Acesse sua conta
            </h1>
            <p className="body-md text-gray-200 mb-8">
              Informe seu e-mail e senha para entrar
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <Input
                label="E-MAIL"
                type="email"
                icon="mail"
                placeholder="Seu e-mail cadastrado"
                value={dados_login.email}
                onChange={(e) => handleMudanca('email', e.target.value)}
                error={erros.email}
                required
                disabled={carregando}
              />

              {/* Campo Senha */}
              <Input
                label="SENHA"
                type="password"
                icon="lock"
                placeholder="Sua senha de acesso"
                value={dados_login.senha}
                onChange={(e) => handleMudanca('senha', e.target.value)}
                error={erros.senha}
                required
                disabled={carregando}
              />

              {/* Mensagem de Erro Geral */}
              {erro && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <div className="w-4 h-4 bg-danger rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className="body-sm text-danger">{erro}</span>
                </div>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon="arrow-right"
                disabled={carregando}
                loading={carregando}
                className="w-full"
              >
                Acessar
              </Button>
            </form>

            {/* Seção de Cadastro */}
            <div className="mt-11 pt-12 border-gray-100">
              <p className="body-md text-gray-300 text-start mb-4">
                Ainda não tem uma conta?
              </p>
              <Button
                variant="secondary"
                size="lg"
                icon="arrow-right"
                className="w-full"
                onClick={() => router.push('/registrar')}
              >
                Cadastrar
              </Button>
            </div>           
          </div>
        </div>
      </div>
    </div>
  );
}