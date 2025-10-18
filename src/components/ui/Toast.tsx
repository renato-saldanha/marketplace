'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'bg-success/10 border-success/20 text-success',
  error: 'bg-danger/10 border-danger/20 text-danger',
  warning: 'bg-orange-base/10 border-orange-base/20 text-orange-base',
  info: 'bg-blue-base/10 border-blue-base/20 text-blue-base',
};

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = toastIcons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300',
        toastStyles[type],
        isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <p className="body-sm font-medium">{title}</p>
        {message && (
          <p className="body-xs opacity-80 mt-1">{message}</p>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Container para gerenciar múltiplos toasts
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expor função global para adicionar toasts
  useEffect(() => {
    (window as any).showToast = addToast;
    return () => {
      delete (window as any).showToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

// Hook para usar toasts
export function useToast() {
  const showToast = (toast: Omit<ToastProps, 'id'>) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(toast);
    }
  };

  return {
    showToast,
    success: (title: string, message?: string) => showToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => showToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => showToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => showToast({ type: 'info', title, message }),
  };
}
