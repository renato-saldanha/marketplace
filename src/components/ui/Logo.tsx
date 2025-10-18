'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src="/logo_marketplace.png"
          alt="Marketplace Logo"
          fill
          sizes="(max-width: 768px) 24px, 32px"
          className="object-contain"
          priority
        />
      </div>
      
      {/* Texto do Logo */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-dm-sans font-bold text-gray-500 ${textSizeClasses[size]}`}>
            Marketplace
          </span>
          <span className="body-xs text-gray-200">
            Painel de Vendedor
          </span>
        </div>
      )}
    </div>
  );
}
