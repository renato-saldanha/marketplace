// PWA utilities
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker not supported');
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('[PWA] Service Worker registered:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('[PWA] New version available');
              
              // Notify user about update
              if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  });
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('[PWA] Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

// Show notification
export function showNotification(
  title: string,
  options?: NotificationOptions
) {
  if (!('Notification' in window)) {
    console.log('[PWA] Notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        ...options,
      } as any);
    });
  }
}

// Check if app is installed
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// Install prompt
let deferredPrompt: any = null;

export function setupInstallPrompt() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button
    const installEvent = new CustomEvent('pwaInstallAvailable');
    window.dispatchEvent(installEvent);
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed');
    deferredPrompt = null;
  });
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`[PWA] User ${outcome} the install prompt`);
  deferredPrompt = null;
  
  return outcome === 'accepted';
}

// Background sync
export async function requestBackgroundSync(tag: string): Promise<void> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.log('[PWA] Background Sync not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register(tag);
    console.log(`[PWA] Background sync registered: ${tag}`);
  } catch (error) {
    console.error('[PWA] Background sync failed:', error);
  }
}

// Check for updates
export async function checkForUpdates(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return true;
    }
  } catch (error) {
    console.error('[PWA] Update check failed:', error);
  }

  return false;
}

// Get network status
export function getNetworkStatus(): {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
} {
  if (typeof window === 'undefined') {
    return { online: true };
  }

  const connection = (navigator as any).connection;
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
  };
}

// Listen to network changes
export function onNetworkChange(
  callback: (online: boolean) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

