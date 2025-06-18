import React from 'react';
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

interface DividendsChartProps {
  data: SimulationDataPoint[];
}

export const DividendsChart: React.FC<DividendsChartProps> = ({ data }) => {
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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorDividendos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorCrescimento" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.1} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="dividendosRecebidosDividendos"
          stackId="1"
          stroke="#1976d2"
          fillOpacity={1}
          fill="url(#colorDividendos)"
        />
        <Area
          type="monotone"
          dataKey="dividendosRecebidosCrescimento"
          stackId="1"
          stroke="#2e7d32"
          fillOpacity={1}
          fill="url(#colorCrescimento)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};