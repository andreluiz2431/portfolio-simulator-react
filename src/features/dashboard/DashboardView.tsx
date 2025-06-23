import React from 'react';
import { Grid, Typography, Card, CardContent, Box, Chip } from '@mui/material';
import { TrendingUp, DollarSign, PieChart, Calendar } from 'lucide-react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { PatrimonyEvolutionChart } from './PatrimonyEvolutionChart';
import { DividendsChart } from './DividendsChart';
import { SummaryMetrics } from './SummaryMetrics';

export const DashboardView: React.FC = () => {
  const { simulationResult, simulationParams, isLoading } = usePortfolioStore();

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Carregando Simulação...
          </Typography>
        </Box>
        <SummaryMetrics loading={true} />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <PatrimonyEvolutionChart loading={true} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DividendsChart loading={true} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!simulationResult) {
    return (
      <Card sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <PieChart size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            Nenhuma simulação executada
          </Typography>
          <Typography variant="body2">
            Configure suas carteiras e execute a simulação para ver os resultados
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Resultados da Simulação
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<Calendar size={16} />}
            label={`${simulationParams.periodoAnos} anos`}
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<DollarSign size={16} />}
            label={`R$ ${simulationParams.aporteMensal}/mês`}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Metrics */}
        <Grid item xs={12}>
          <SummaryMetrics result={simulationResult} />
        </Grid>

        {/* Patrimony Evolution Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp size={20} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Evolução do Patrimônio
                </Typography>
              </Box>
              <PatrimonyEvolutionChart data={simulationResult.dadosMensais} />
            </CardContent>
          </Card>
        </Grid>

        {/* Dividends Chart */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DollarSign size={20} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Dividendos Acumulados
                </Typography>
              </Box>
              <DividendsChart data={simulationResult.dadosMensais} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};