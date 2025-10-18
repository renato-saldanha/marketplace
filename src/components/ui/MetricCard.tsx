import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icone: LucideIcon;
  cor: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  tendencia?: {
    valor: number;
    tipo: 'up' | 'down' | 'neutral';
  };
  loading?: boolean;
}

const cores = {
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    border: 'border-green-200',
  },
  orange: {
    bg: 'bg-orange-100',
    icon: 'text-orange-600',
    border: 'border-orange-200',
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    border: 'border-purple-200',
  },
  red: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    border: 'border-red-200',
  },
};

export default function MetricCard({
  titulo,
  valor,
  subtitulo,
  icone: Icon,
  cor,
  tendencia,
  loading = false,
}: MetricCardProps) {
  const corConfig = cores[cor];

  if (loading) {
    return (
      <div className={`bg-white border ${corConfig.border} rounded-xl p-6 shadow-sm animate-pulse`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 ${corConfig.bg} rounded-lg`}></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border ${corConfig.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 ${corConfig.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${corConfig.icon}`} />
        </div>
        <div className="flex-1">
          <p className="text-3xl font-bold text-gray-800">
            {typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor}
          </p>
          <p className="text-gray-600">{titulo}</p>
          {subtitulo && (
            <p className="text-sm text-gray-500 mt-1">{subtitulo}</p>
          )}
        </div>
      </div>
      
      {tendencia && (
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${
            tendencia.tipo === 'up' ? 'text-green-600' :
            tendencia.tipo === 'down' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {tendencia.tipo === 'up' && '+'}
            {tendencia.valor}%
          </span>
          <span className="text-sm text-gray-500">
            vs mês anterior
          </span>
        </div>
      )}
    </div>
  );
}
