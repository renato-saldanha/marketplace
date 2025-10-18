'use client';

import Image from 'next/image';

export default function MarketingBackground() {
  return (
    <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <Image
          src="/cover.png"
          alt="Marketplace Cover"
          fill
          sizes="(max-width: 1024px) 0vw, 67vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-base/10 to-orange-base/10"></div>

      {/* Elementos decorativos */}
      <div className="absolute inset-0">
        {/* Linha ondulada decorativa */}
        <svg className="absolute bottom-0 w-full h-32 opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,300 Q250,100 500,300 T1000,300 L1000,120 L0,120 Z" 
            fill="url(#gradient)" 
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F24D0D" />
              <stop offset="100%" stopColor="#5EC5FD" />
            </linearGradient>
          </defs>
        </svg>
      </div>     
    </div>
  );
}
