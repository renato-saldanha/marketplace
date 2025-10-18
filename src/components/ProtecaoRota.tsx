'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useAutenticacao } from '@/lib/hooks/useApi';

interface ProtecaoRotaProps {
  children: React.ReactNode;
}

export default function ProtecaoRota({ children }: ProtecaoRotaProps) {
  const [verificando, set_verificando] = useState(true);
  const router = useRouter();
  
  // Usar hook de autenticação
  const { estaAutenticado, verificarAutenticacao } = useAutenticacao();

  useEffect(() => {
    const verificar_autenticacao = async () => {
      try {
        // Verificar se há token
        if (!estaAutenticado) {
          router.push('/login');
          return;
        }

        // Verificar se o token é válido
        const valido = await verificarAutenticacao();
        if (!valido) {
          router.push('/login');
          return;
        }
      } catch (erro) {
        console.error('Erro na verificação de autenticação:', erro);
        router.push('/login');
      } finally {
        set_verificando(false);
      }
    };

    verificar_autenticacao();
  }, [router, estaAutenticado, verificarAutenticacao]);

  if (verificando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verificando autenticação...
          </h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return null; // O redirecionamento já foi feito
  }

  return <>{children}</>;
}
