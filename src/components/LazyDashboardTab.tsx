'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Lazy load do DashboardTab
const DashboardTab = dynamic(() => import('./DashboardTab'), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      <span className="ml-3 text-gray-600">Carregando dashboard...</span>
    </div>
  ),
  ssr: false,
});

export default DashboardTab;


