'use client';

import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import Button from './Button';
import Input from './Input';

interface ModalAlterarSenhaProps {
  aberto: boolean;
  onFechar: () => void;
  onAlterarSenha: (dados: { senha_atual: string; nova_senha: string }) => Promise<void>;
}

export default function ModalAlterarSenha({ aberto, onFechar, onAlterarSenha }: ModalAlterarSenhaProps) {
  const [dados, setDados] = useState({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);

  const handleChange = (campo: keyof typeof dados, valor: string) => {
    setDados(prev => ({
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

    if (!dados.senha_atual.trim()) {
      novosErros.senha_atual = 'Senha atual é obrigatória';
    }

    if (!dados.nova_senha.trim()) {
      novosErros.nova_senha = 'Nova senha é obrigatória';
    } else if (dados.nova_senha.length < 6) {
      novosErros.nova_senha = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    if (!dados.confirmar_senha.trim()) {
      novosErros.confirmar_senha = 'Confirmação de senha é obrigatória';
    } else if (dados.nova_senha !== dados.confirmar_senha) {
      novosErros.confirmar_senha = 'Senhas não coincidem';
    }

    if (dados.senha_atual === dados.nova_senha) {
      novosErros.nova_senha = 'Nova senha deve ser diferente da atual';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    
    try {
      await onAlterarSenha({
        senha_atual: dados.senha_atual,
        nova_senha: dados.nova_senha
      });
      
      // Limpar formulário e fechar modal
      setDados({
        senha_atual: '',
        nova_senha: '',
        confirmar_senha: ''
      });
      setErros({});
      onFechar();
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Alterar Senha</h2>
              <p className="text-sm text-gray-500">Digite sua senha atual e a nova senha</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            disabled={carregando}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <Input
            label="Senha Atual"
            type="password"
            placeholder="Digite sua senha atual"
            icon="lock"
            value={dados.senha_atual}
            onChange={(e) => handleChange('senha_atual', e.target.value)}
            error={erros.senha_atual}
            disabled={carregando}
          />

          <Input
            label="Nova Senha"
            type="password"
            placeholder="Digite a nova senha (mínimo 6 caracteres)"
            icon="lock"
            value={dados.nova_senha}
            onChange={(e) => handleChange('nova_senha', e.target.value)}
            error={erros.nova_senha}
            disabled={carregando}
          />

          <Input
            label="Confirmar Nova Senha"
            type="password"
            placeholder="Confirme a nova senha"
            icon="lock"
            value={dados.confirmar_senha}
            onChange={(e) => handleChange('confirmar_senha', e.target.value)}
            error={erros.confirmar_senha}
            disabled={carregando}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onFechar}
            disabled={carregando}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={carregando}
            disabled={carregando}
          >
            Alterar Senha
          </Button>
        </div>
      </div>
    </div>
  );
}
