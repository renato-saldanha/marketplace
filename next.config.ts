import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Otimizações de performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configuração de imagens
  images: {
    remotePatterns: [
      // Desenvolvimento local
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      // Render (produção) - ajuste o hostname conforme sua URL
      {
        protocol: 'https',
        hostname: '*.onrender.com',
        pathname: '/uploads/**',
      },
      // Domínio customizado (se configurar)
      // {
      //   protocol: 'https',
      //   hostname: 'api.seusite.com',
      //   pathname: '/uploads/**',
      // },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features para melhor performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
  
  // Configuração de build
  poweredByHeader: false,
  
  // Configuração para Docker (standalone output)
  // Descomente se for usar Docker:
  // output: 'standalone',
};

export default nextConfig;
