import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DadosVendas } from '@/lib/hooks/useDashboard';

interface VendasChartProps {
  dados: DadosVendas[];
  loading?: boolean;
}

const formatarData = (data: string) => {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const formatarTooltip = (value: number, name: string) => {
  if (name === 'vendas') {
    return [`${value} vendas`, 'Vendas'];
  }
  if (name === 'visitantes') {
    return [`${value} visitantes`, 'Visitantes'];
  }
  return [value, name];
};

export default function VendasChart({ dados, loading = false }: VendasChartProps) {
  if (loading) {
    return (
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
            </div>
            <p className="text-gray-500">Carregando gráfico...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return (
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-gray-400 text-4xl">📊</div>
            </div>
            <p className="text-gray-500">Nenhum dado disponível</p>
            <p className="text-sm text-gray-400 mt-1">Cadastre produtos para ver as estatísticas</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="data" 
            tickFormatter={formatarData}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            formatter={formatarTooltip}
            labelFormatter={(label) => `Data: ${formatarData(label)}`}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="vendas" 
            stroke="#f97316" 
            strokeWidth={3}
            dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
            name="Vendas"
          />
          <Line 
            type="monotone" 
            dataKey="visitantes" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
            name="Visitantes"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
