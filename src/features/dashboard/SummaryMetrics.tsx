import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Tooltip, Skeleton } from '@mui/material';
import { TrendingUp, DollarSign, PieChart, Award } from 'lucide-react';
import { SimulationResult } from '../../types';

interface SummaryMetricsProps {
  result?: SimulationResult;
  loading?: boolean;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ result, loading = false }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading || !result) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={120} />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Skeleton variant="rectangular" width={12} height={12} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="text" width={80} />
                  </Box>
                  <Skeleton variant="text" width={140} height={32} />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Skeleton variant="rectangular" width={12} height={12} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="text" width={80} />
                  </Box>
                  <Skeleton variant="text" width={140} height={32} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  const { resumoFinal } = result;
  const dividendosWins = resumoFinal.dividendos.patrimonioFinal > resumoFinal.crescimento.patrimonioFinal;
  
  const metrics = [
    {
      title: 'Patrimônio Final',
      icon: PieChart,
      dividendos: formatCurrency(resumoFinal.dividendos.patrimonioFinal),
      crescimento: formatCurrency(resumoFinal.crescimento.patrimonioFinal),
      winner: dividendosWins ? 'dividendos' : 'crescimento',
      tooltip: 'Soma do total aportado com os juros e dividendos reinvestidos ao final do período.',
    },
    {
      title: 'Total Aportado',
      icon: DollarSign,
      dividendos: formatCurrency(resumoFinal.dividendos.totalAportado),
      crescimento: formatCurrency(resumoFinal.crescimento.totalAportado),
      winner: null,
      tooltip: 'Valor total investido ao longo do período, sem considerar a rentabilidade.',
    },
    {
      title: 'Dividendos Recebidos',
      icon: Award,
      dividendos: formatCurrency(resumoFinal.dividendos.totalDividendos),
      crescimento: formatCurrency(resumoFinal.crescimento.totalDividendos),
      winner: resumoFinal.dividendos.totalDividendos > resumoFinal.crescimento.totalDividendos ? 'dividendos' : 'crescimento',
      tooltip: 'Soma de todos os dividendos ou juros sobre capital próprio recebidos ao longo do período.',
    },
    {
      title: 'Rentabilidade Total',
      icon: TrendingUp,
      dividendos: formatPercentage(resumoFinal.dividendos.rentabilidadeTotal),
      crescimento: formatPercentage(resumoFinal.crescimento.rentabilidadeTotal),
      winner: resumoFinal.dividendos.rentabilidadeTotal > resumoFinal.crescimento.rentabilidadeTotal ? 'dividendos' : 'crescimento',
      tooltip: 'Ganho percentual sobre o valor total aportado. Fórmula: ((Patrimônio Final - Total Aportado) / Total Aportado) * 100',
    },
  ];

  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '100%', position: 'relative' }}>
            <CardContent>
              <Tooltip title={metric.tooltip} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, cursor: 'help' }}>
                  <metric.icon size={20} color="#666" />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {metric.title}
                  </Typography>
                </Box>
              </Tooltip>
              
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