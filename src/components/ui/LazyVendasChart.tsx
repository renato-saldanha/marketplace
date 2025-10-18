'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Lazy load do VendasChart (Recharts é pesado)
const VendasChart = dynamic(() => import('./VendasChart'), {
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
      <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      <span className="ml-2 text-gray-600 text-sm">Carregando gráfico...</span>
    </div>
  ),
  ssr: false,
});

export default VendasChart;


