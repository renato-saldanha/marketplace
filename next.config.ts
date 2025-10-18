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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
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
  output: 'standalone',
};

export default nextConfig;
