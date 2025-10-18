'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { 
  registerServiceWorker, 
  setupInstallPrompt, 
  promptInstall,
  isAppInstalled 
} from '@/lib/pwa';
import Button from './ui/Button';

export default function PWAInstaller() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Setup install prompt
    setupInstallPrompt();

    // Check if already installed
    setIsInstalled(isAppInstalled());

    // Listen for install available event
    const handleInstallAvailable = () => {
      if (!isAppInstalled()) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('pwaInstallAvailable', handleInstallAvailable);

    return () => {
      window.removeEventListener('pwaInstallAvailable', handleInstallAvailable);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setShowInstallPrompt(false);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Save dismissed state to localStorage
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  // Check if was dismissed
  if (typeof window !== 'undefined' && localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="card-base p-4 shadow-lg border-2 border-orange-base">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-orange-base/10 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-orange-base" />
          </div>
          
          <div className="flex-1">
            <h3 className="title-sm text-gray-400 mb-1">
              Instalar Aplicativo
            </h3>
            <p className="body-sm text-gray-200 mb-3">
              Adicione o Marketplace à sua tela inicial para acesso rápido e funcionalidades offline.
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstall}
                className="flex-1"
              >
                Instalar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
              >
                Agora não
              </Button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-200 hover:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

