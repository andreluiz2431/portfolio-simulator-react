import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, DollarSign, PieChart, Award } from 'lucide-react';
import { SimulationResult } from '../../types';

interface SummaryMetricsProps {
  result: SimulationResult;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ result }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const { resumoFinal } = result;
  const dividendosWins = resumoFinal.dividendos.patrimonioFinal > resumoFinal.crescimento.patrimonioFinal;
  
  const metrics = [
    {
      title: 'Patrimônio Final',
      icon: PieChart,
      dividendos: formatCurrency(resumoFinal.dividendos.patrimonioFinal),
      crescimento: formatCurrency(resumoFinal.crescimento.patrimonioFinal),
      winner: dividendosWins ? 'dividendos' : 'crescimento',
    },
    {
      title: 'Total Aportado',
      icon: DollarSign,
      dividendos: formatCurrency(resumoFinal.dividendos.totalAportado),
      crescimento: formatCurrency(resumoFinal.crescimento.totalAportado),
      winner: null,
    },
    {
      title: 'Dividendos Recebidos',
      icon: Award,
      dividendos: formatCurrency(resumoFinal.dividendos.totalDividendos),
      crescimento: formatCurrency(resumoFinal.crescimento.totalDividendos),
      winner: resumoFinal.dividendos.totalDividendos > resumoFinal.crescimento.totalDividendos ? 'dividendos' : 'crescimento',
    },
    {
      title: 'Rentabilidade Total',
      icon: TrendingUp,
      dividendos: formatPercentage(resumoFinal.dividendos.rentabilidadeTotal),
      crescimento: formatPercentage(resumoFinal.crescimento.rentabilidadeTotal),
      winner: resumoFinal.dividendos.rentabilidadeTotal > resumoFinal.crescimento.rentabilidadeTotal ? 'dividendos' : 'crescimento',
    },
  ];

  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '100%', position: 'relative' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <metric.icon size={20} color="#666" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {metric.title}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#1976d2',
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Dividendos
                  </Typography>
                  {metric.winner === 'dividendos' && (
                    <Chip label="Melhor" size="small" color="success" sx={{ ml: 'auto', fontSize: '0.6rem', height: 16 }} />
                  )}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {metric.dividendos}
                </Typography>
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#2e7d32',
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Crescimento
                  </Typography>
                  {metric.winner === 'crescimento' && (
                    <Chip label="Melhor" size="small" color="success" sx={{ ml: 'auto', fontSize: '0.6rem', height: 16 }} />
                  )}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {metric.crescimento}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};