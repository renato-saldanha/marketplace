'use client';

import { TrendingUp, Tag, Store, Users, DollarSign, Eye, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/lib/hooks/useDashboard';
import MetricCard from '@/components/ui/MetricCard';
import VendasChart from '@/components/ui/VendasChart';
import ProdutosDestaque from '@/components/ui/ProdutosDestaque';
import SeletorPeriodo from '@/components/ui/SeletorPeriodo';

export default function DashboardTab() {
  const { 
    metricas, 
    dadosVendas, 
    produtosDestaque, 
    periodoSelecionado, 
    setPeriodoSelecionado, 
    carregando 
  } = useDashboard();
  const router = useRouter();

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const handleProdutoClick = (produtoId: string) => {
    router.push(`/produtos/editar/${produtoId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Confira as estatísticas da sua loja</p>
        </div>
        <SeletorPeriodo 
          periodoSelecionado={periodoSelecionado}
          onPeriodoChange={setPeriodoSelecionado}
          loading={carregando}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <MetricCard
            titulo="Produtos Ativos"
            valor={metricas.produtosAtivos}
            icone={Tag}
            cor="blue"
            loading={carregando}
            tendencia={{ valor: 12, tipo: 'up' }}
          />

          <MetricCard
            titulo="Produtos Vendidos"
            valor={metricas.produtosVendidos}
            icone={Package}
            cor="green"
            loading={carregando}
            tendencia={{ valor: 8, tipo: 'up' }}
          />

          <MetricCard
            titulo="Total em Vendas"
            valor={formatarValor(metricas.totalVendas)}
            icone={DollarSign}
            cor="orange"
            loading={carregando}
            tendencia={{ valor: 15, tipo: 'up' }}
          />

          <MetricCard
            titulo="Visitantes"
            valor={metricas.visitantes}
            icone={Eye}
            cor="purple"
            loading={carregando}
            subtitulo="Últimos 30 dias"
            tendencia={{ valor: 5, tipo: 'up' }}
          />

          <MetricCard
            titulo="Ticket Médio"
            valor={formatarValor(metricas.ticketMedio)}
            icone={TrendingUp}
            cor="red"
            loading={carregando}
            subtitulo="Por venda"
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Vendas e Visitantes</h3>
              <span className="text-sm text-gray-500">{periodoSelecionado.label}</span>
            </div>
            
            <VendasChart dados={dadosVendas} loading={carregando} />
          </div>

          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
            <ProdutosDestaque 
              produtos={produtosDestaque} 
              loading={carregando}
              onProdutoClick={handleProdutoClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
