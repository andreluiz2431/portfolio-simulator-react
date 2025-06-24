import React, { useState } from 'react';
import { Grid, Typography, Card, CardContent, Box, Chip } from '@mui/material';
import { TrendingUp, DollarSign, PieChart, Calendar } from 'lucide-react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { PatrimonyEvolutionChart } from './PatrimonyEvolutionChart';
import { DividendsChart } from './DividendsChart';
import { SummaryMetrics } from './SummaryMetrics';
import { agruparDadosPorPeriodo, PeriodoFiltro } from './chartUtils';
import { saveAs } from 'file-saver';

function exportarRelatorioCSV(simulationResult: any, portfolios: any) {
  if (!simulationResult) return;
  // Resumo
  let csv = 'Resumo das Carteiras\n';
  const resumo = simulationResult.resumoFinal;
  const metricas = ['patrimonioFinal', 'totalAportado', 'totalDividendos', 'rentabilidadeTotal'];
  const metricasLabel = ['Patrimônio Final', 'Total Aportado', 'Dividendos Recebidos', 'Rentabilidade Total (%)'];
  csv += 'Carteira,' + metricasLabel.join(',') + '\n';
  Object.entries(resumo).forEach(([carteiraId, data]: any) => {
    const nome = portfolios.find((p: any) => p.id === carteiraId)?.nome || carteiraId;
    csv += nome + ',' + metricas.map((k) => data[k]).join(',') + '\n';
  });
  csv += '\n';
  // Evolução Mensal
  csv += 'Evolução Mensal\n';
  const dadosMensais = simulationResult.dadosMensais;
  // Cabeçalho
  let header = ['Mês'];
  portfolios.forEach((p: any) => {
    header.push(`Patrimônio ${p.nome}`);
    header.push(`Dividendos ${p.nome}`);
    header.push(`Aportado ${p.nome}`);
  });
  csv += header.join(',') + '\n';
  dadosMensais.forEach((item: any) => {
    let row = [item.mes];
    portfolios.forEach((p: any) => {
      row.push(item.patrimonio[p.id] ?? '');
      row.push(item.dividendosRecebidos[p.id] ?? '');
      row.push(item.totalAportado[p.id] ?? '');
    });
    csv += row.join(',') + '\n';
  });
  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'relatorio_simulacao.csv');
}

export const DashboardView: React.FC = () => {
  const { simulationResult, simulationParams, isLoading, portfolios } = usePortfolioStore();

  // Estado do filtro de período
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('mensal');

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

  // Aplica o filtro aos dados mensais
  const dadosFiltrados = agruparDadosPorPeriodo(simulationResult.dadosMensais, periodo);

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

      {/* Filtro de Período + Exportar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <Chip
          label="Mensal"
          color={periodo === 'mensal' ? 'primary' : 'default'}
          variant={periodo === 'mensal' ? 'filled' : 'outlined'}
          onClick={() => setPeriodo('mensal')}
        />
        <Chip
          label="Anual"
          color={periodo === 'anual' ? 'primary' : 'default'}
          variant={periodo === 'anual' ? 'filled' : 'outlined'}
          onClick={() => setPeriodo('anual')}
        />
        <Chip
          label="Total"
          color={periodo === 'total' ? 'primary' : 'default'}
          variant={periodo === 'total' ? 'filled' : 'outlined'}
          onClick={() => setPeriodo('total')}
        />
        <Box sx={{ flex: 1 }} />
        <button
          style={{ padding: '8px 16px', background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}
          onClick={() => exportarRelatorioCSV(simulationResult, portfolios)}
          disabled={!simulationResult}
        >
          Exportar Relatório (CSV)
        </button>
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
              <PatrimonyEvolutionChart data={dadosFiltrados} periodo={periodo} />
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
              <DividendsChart data={dadosFiltrados} periodo={periodo} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};