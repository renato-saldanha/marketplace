import type { Metadata, Viewport } from 'next';
import { DM_Sans, Poppins } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import PWAInstaller from '@/components/PWAInstaller';

// Configurar DM Sans para títulos
const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

// Configurar Poppins para corpo do texto
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Marketplace - Painel do Vendedor',
  description: 'Sistema de gestão de produtos para vendedores do marketplace',
  keywords: 'marketplace, vendedor, produtos, gestão, e-commerce',
  authors: [{ name: 'Zeine Challenge' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Marketplace',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${poppins.variable} font-poppins`}>
        <ErrorBoundary>
          {children}
          <ToastContainer />
          <PWAInstaller />
        </ErrorBoundary>
      </body>
    </html>
  );
}