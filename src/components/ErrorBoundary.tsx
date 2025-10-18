'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="card-base p-8 text-center">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
              
              <h1 className="title-md text-gray-400 mb-4">
                Ops! Algo deu errado
              </h1>
              
              <p className="body-md text-gray-200 mb-6">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-danger/10 rounded-lg text-left">
                  <h3 className="body-sm font-medium text-danger mb-2">
                    Detalhes do erro (desenvolvimento):
                  </h3>
                  <pre className="body-xs text-danger whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="body-xs text-danger cursor-pointer">
                        Stack trace
                      </summary>
                      <pre className="body-xs text-danger whitespace-pre-wrap mt-2">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="md"
                  icon="home"
                  onClick={this.handleGoHome}
                >
                  Ir para Home
                </Button>
                
                <Button
                  variant="primary"
                  size="md"
                  icon="refresh"
                  onClick={this.handleReload}
                >
                  Recarregar Página
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para capturar erros em componentes funcionais
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // Em produção, você poderia enviar o erro para um serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: Sentry.captureException(error);
    }
  };

  return { handleError };
}
