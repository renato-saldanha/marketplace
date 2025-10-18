import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Periodo } from '@/lib/hooks/useDashboard';

const periodosPredefinidos: Periodo[] = [
  { label: 'Últimos 7 dias', valor: '7d', dias: 7 },
  { label: 'Últimos 30 dias', valor: '30d', dias: 30 },
  { label: 'Últimos 90 dias', valor: '90d', dias: 90 },
  { label: 'Último ano', valor: '1y', dias: 365 },
];

interface SeletorPeriodoProps {
  periodoSelecionado: Periodo;
  onPeriodoChange: (periodo: Periodo) => void;
  loading?: boolean;
}

export default function SeletorPeriodo({ 
  periodoSelecionado, 
  onPeriodoChange, 
  loading = false 
}: SeletorPeriodoProps) {
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const handlePeriodoClick = (periodo: Periodo) => {
    onPeriodoChange(periodo);
    setDropdownAberto(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownAberto(!dropdownAberto)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {periodoSelecionado.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
          dropdownAberto ? 'rotate-180' : ''
        }`} />
      </button>

      {dropdownAberto && (
        <>
          {/* Overlay para fechar o dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setDropdownAberto(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {periodosPredefinidos.map((periodo) => (
                <button
                  key={periodo.valor}
                  onClick={() => handlePeriodoClick(periodo)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                    periodoSelecionado.valor === periodo.valor
                      ? 'bg-orange-50 text-orange-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {periodo.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
