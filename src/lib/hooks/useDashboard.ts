import { useState, useEffect, useCallback } from 'react';
import { useProdutos } from './useApi';
import { Produto } from '../api';

export interface Periodo {
  label: string;
  valor: string;
  dias: number;
}

export interface MetricasDashboard {
  produtosAtivos: number;
  produtosVendidos: number;
  totalVendas: number;
  visitantes: number;
  produtosCadastrados: number;
  ticketMedio: number;
}

export interface DadosVendas {
  data: string;
  vendas: number;
  visitantes: number;
}

export function useDashboard() {
  const { produtos, carregarProdutos } = useProdutos();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<Periodo>({
    label: 'Últimos 30 dias',
    valor: '30d',
    dias: 30,
  });
  const [metricas, setMetricas] = useState<MetricasDashboard>({
    produtosAtivos: 0,
    produtosVendidos: 0,
    totalVendas: 0,
    visitantes: 0,
    produtosCadastrados: 0,
    ticketMedio: 0,
  });
  const [dadosVendas, setDadosVendas] = useState<DadosVendas[]>([]);
  const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  const calcularMetricas = useCallback((produtosData: any[]) => {
    if (!produtosData || produtosData.length === 0) {
      return {
        produtosAtivos: 0,
        produtosVendidos: 0,
        totalVendas: 0,
        visitantes: 0,
        produtosCadastrados: 0,
        ticketMedio: 0,
      };
    }

    const produtosAtivos = produtosData.filter(p => p.status === 'ativo').length;
    const produtosVendidos = produtosData.filter(p => p.status === 'vendido').length;
    const produtosCadastrados = produtosData.length;
    
    // Simular dados de vendas baseados nos produtos vendidos
    const totalVendas = produtosVendidos * 150; // Valor médio simulado
    const ticketMedio = produtosVendidos > 0 ? totalVendas / produtosVendidos : 0;
    
    // Simular visitantes (baseado no número de produtos)
    const visitantes = produtosCadastrados * 25; // 25 visitantes por produto em média

    return {
      produtosAtivos,
      produtosVendidos,
      totalVendas,
      visitantes,
      produtosCadastrados,
      ticketMedio,
    };
  }, []);

  const gerarDadosVendas = useCallback((produtosData: any[], dias: number) => {
    // Gerar dados baseados no período selecionado
    const dados: DadosVendas[] = [];
    const hoje = new Date();
    
    for (let i = dias - 1; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      
      // Simular vendas baseadas no número de produtos
      const vendasSimuladas = Math.floor(Math.random() * 3) + (produtosData.length > 0 ? 1 : 0);
      const visitantesSimulados = Math.floor(Math.random() * 20) + (produtosData.length * 2);
      
      dados.push({
        data: data.toISOString().split('T')[0],
        vendas: vendasSimuladas,
        visitantes: visitantesSimulados,
      });
    }
    
    return dados;
  }, []);

  const carregarDadosDashboard = useCallback(async () => {
    setCarregando(true);
    try {
      // Carregar produtos do usuário
      await carregarProdutos();
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setCarregando(false);
    }
  }, [carregarProdutos]);

  useEffect(() => {
    if (produtos) {
      const novasMetricas = calcularMetricas(produtos);
      setMetricas(novasMetricas);
      
      const novosDadosVendas = gerarDadosVendas(produtos, periodoSelecionado.dias);
      setDadosVendas(novosDadosVendas);
      
      // Produtos em destaque (primeiros 3 produtos ativos)
      const produtosEmDestaque = produtos
        .filter(p => p.status === 'ativo')
        .slice(0, 3);
      setProdutosDestaque(produtosEmDestaque);
    }
  }, [produtos, periodoSelecionado.dias, calcularMetricas, gerarDadosVendas]);

  useEffect(() => {
    carregarDadosDashboard();
  }, [carregarDadosDashboard]);

  return {
    metricas,
    dadosVendas,
    produtosDestaque,
    periodoSelecionado,
    setPeriodoSelecionado,
    carregando,
    recarregar: carregarDadosDashboard,
  };
}