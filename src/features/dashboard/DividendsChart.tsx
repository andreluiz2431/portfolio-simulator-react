import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SimulationDataPoint } from '../../types';
import { usePortfolioStore } from '../../stores/portfolioStore';

interface DividendsChartProps {
  data?: SimulationDataPoint[];
  loading?: boolean;
}

export const DividendsChart: React.FC<DividendsChartProps> = ({ data = [], loading = false }) => {
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
    const label = name === 'dividendosRecebidosDividendos' ? 'Carteira Dividendos' : 'Carteira Crescimento';
    return [formatCurrency(value), label];
  };

  const formatXAxis = (tickItem: number) => {
    const years = Math.floor(tickItem / 12);
    return `${years}a`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </CardContent>
      </Card>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          {portfolios.map((p) => (
            <linearGradient key={p.id} id={`color${p.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={p.corTema} stopOpacity={0.3} />
              <stop offset="95%" stopColor={p.corTema} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="mes" 
          tickFormatter={formatXAxis}
          stroke="#666"
          fontSize={12}
        />
        <YAxis
          tickFormatter={formatCurrency}
          stroke="#666"
          fontSize={12}
        />
        <Tooltip formatter={formatTooltip} />
        {portfolios.map((p) => (
          <Area
            key={p.id}
            type="monotone"
            dataKey={`dividendosRecebidos.${p.id}`}
            name={p.nome}
            stroke={p.corTema}
            fillOpacity={1}
            fill={`url(#color${p.id})`}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};