'use client';

import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Logo size="lg" className="justify-center mb-8" />
        
        <div className="card-base p-8">
          <div className="w-20 h-20 bg-orange-base/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-orange-base" />
          </div>
          
          <h1 className="title-lg text-gray-400 mb-4">
            Você está offline
          </h1>
          
          <p className="body-md text-gray-200 mb-8">
            Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente novamente.
          </p>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              icon="refresh"
              onClick={handleReload}
              className="w-full"
            >
              Tentar Novamente
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              icon="home"
              onClick={handleGoHome}
              className="w-full"
            >
              Ir para Home
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-light rounded-lg">
            <p className="body-xs text-blue-dark">
              💡 <strong>Dica:</strong> Algumas funcionalidades podem estar disponíveis offline graças ao cache do aplicativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

