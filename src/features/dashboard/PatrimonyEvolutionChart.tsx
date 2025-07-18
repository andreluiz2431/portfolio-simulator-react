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

interface PatrimonyEvolutionChartProps {
  data?: SimulationDataPoint[];
  loading?: boolean;
}

export const PatrimonyEvolutionChart: React.FC<PatrimonyEvolutionChartProps> = ({ 
  data = [], 
  loading = false 
}) => {
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
    const years = Math.floor(tickItem / 12);
    const months = tickItem % 12;
    if (months === 0) {
      return `${years}a`;
    }
    return `${years}a ${months}m`;
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
          labelFormatter={(label) => `Mês ${label}`}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="patrimonioDividendos"
          stroke="#1976d2"
          strokeWidth={3}
          dot={false}
          name="Carteira Dividendos"
          activeDot={{ r: 6, fill: '#1976d2' }}
        />
        <Line
          type="monotone"
          dataKey="patrimonioCrescimento"
          stroke="#2e7d32"
          strokeWidth={3}
          dot={false}
          name="Carteira Crescimento"
          activeDot={{ r: 6, fill: '#2e7d32' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};