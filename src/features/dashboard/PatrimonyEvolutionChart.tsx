import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SimulationDataPoint } from '../../types';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { PeriodoFiltro } from './chartUtils';

interface PatrimonyEvolutionChartProps {
  data?: SimulationDataPoint[];
  loading?: boolean;
  periodo?: PeriodoFiltro;
}

export const PatrimonyEvolutionChart: React.FC<PatrimonyEvolutionChartProps> = ({ 
  data = [], 
  loading = false,
  periodo = 'mensal',
}) => {
  const { portfolios } = usePortfolioStore();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTooltip = (value: number, name: string) => {
    const label = name === 'patrimonioDividendos' ? 'Carteira Dividendos' : 'Carteira Crescimento';
    return [formatCurrency(value), label];
  };

  const formatXAxis = (tickItem: number) => {
    if (periodo === 'anual') {
      return `Ano ${tickItem}`;
    }
    if (periodo === 'total') {
      return 'Total';
    }
    // padrão: mensal
    const years = Math.floor((tickItem - 1) / 12) + 1;
    const months = ((tickItem - 1) % 12) + 1;
    return `${months}/${years}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={400} />
        </CardContent>
      </Card>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="mes" 
          tickFormatter={formatXAxis}
          stroke="#666"
          fontSize={12}
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value)}
          stroke="#666"
          fontSize={12}
        />
        <Tooltip
          formatter={formatTooltip}
          labelFormatter={(label) => {
            if (periodo === 'anual') return `Ano ${label}`;
            if (periodo === 'total') return 'Total';
            // padrão: mensal
            const years = Math.floor((label - 1) / 12) + 1;
            const months = ((label - 1) % 12) + 1;
            return `Mês ${months}/${years}`;
          }}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
        <Legend />
        {portfolios.map((p) => (
          <Line
            key={p.id}
            type="monotone"
            dataKey={`patrimonio.${p.id}`}
            stroke={p.corTema}
            strokeWidth={3}
            dot={false}
            name={p.nome}
            activeDot={{ r: 6, fill: p.corTema }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};