'use client';

import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { Building2, Package, User, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SERVER_BASE_URL } from '@/lib/axios-config';


export default function PageHeader() {
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { fazerLogout, usuario } = useAutenticacao();

  // Determinar aba ativa baseada na rota atual
  const getAbaAtiva = () => {
    if (pathname.startsWith('/produtos')) return 'produtos';
    if (pathname === '/configuracao') return 'configuracao';
    return 'dashboard';
  };

  const abaAtiva = getAbaAtiva();

  const handleLogout = async () => {
    await fazerLogout();
    router.push('/login');
  };
 

  const handleNovoProduto = () => {
    router.push('/produtos/novo');
  };

  const handleNavegacao = (rota: string) => {
    router.push(rota);
    setDropdownAberto(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="lg" showText={false} />
            </div>
            
            <nav className="flex items-center gap-6">
              <button
                onClick={() => handleNavegacao('/')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  abaAtiva === 'dashboard'
                    ? 'bg-orange-base text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Dashboard
              </button>
              
              <button
                onClick={() => handleNavegacao('/produtos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  abaAtiva === 'produtos'
                    ? 'bg-orange-base text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                Produtos
              </button>
            </nav>
            
            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                size="sm"
                icon="plus"
                onClick={handleNovoProduto}
                className="bg-orange-base hover:bg-orange-dark"
              >
                + Novo produto
              </Button>
              
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownAberto(!dropdownAberto)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-base flex items-center justify-center">
                    {usuario && usuario.foto_perfil_thumb ? (
                      <Image
                        src={`${SERVER_BASE_URL}${usuario.foto_perfil_thumb}`}
                        alt={usuario.nome}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>

                {dropdownAberto && (
                  <div className="absolute right-0 mt-2 w-58 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{usuario?.nome}</p>
                      <p className="text-xs text-gray-500">{usuario?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setDropdownAberto(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
  );
}

