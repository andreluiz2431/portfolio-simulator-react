import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Play, Settings, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { usePortfolioStore } from '../../stores/portfolioStore';

export const SimulationControls: React.FC = () => {
  const {
    simulationParams,
    updateSimulationParams,
    runSimulation,
    isSimulating,
    portfolios,
  } = usePortfolioStore();

  const handleParamChange = (field: string, value: number) => {
    updateSimulationParams({ [field]: value });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const canRunSimulation = portfolios.some(p => p.ativos.length > 0);

  const totalAportesAnuais = simulationParams.aporteMensal * 12;
  const totalAportesSimulacao = totalAportesAnuais * simulationParams.periodoAnos;

  return (
    <Card sx={{ mb: 3, backgroundColor: (theme) => theme.palette.background.paper }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Settings size={24} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Configurações da Simulação
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Financial Parameters */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Aporte Mensal"
              type="number"
              value={simulationParams.aporteMensal}
              onChange={(e) => handleParamChange('aporteMensal', Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 100 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Anual: {formatCurrency(totalAportesAnuais)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Período da Simulação"
              type="number"
              value={simulationParams.periodoAnos}
              onChange={(e) => handleParamChange('periodoAnos', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">anos</InputAdornment>,
              }}
              inputProps={{ min: 1, max: 50 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Total: {formatCurrency(totalAportesSimulacao)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 2, 
              backgroundColor: (theme) => theme.palette.background.paper, 
              borderRadius: 2,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: (theme) => theme.shadows[1],
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}>
              {/** Corrigir cor do ícone para modo escuro/claro */}
              <Calendar 
                size={24} 
                color={(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? '#90caf9' : '#1976d2'} 
                style={{ margin: '0 auto 8px' }} 
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {simulationParams.periodoAnos * 12} meses
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Período Total
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Growth Projections */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Projeções de Crescimento Anual
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Carteira Dividendos"
              type="number"
              value={(simulationParams.projecaoCrescimentoDividendos * 100).toFixed(1)}
              onChange={(e) => handleParamChange('projecaoCrescimentoDividendos', Number(e.target.value) / 100)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><TrendingUp size={16} /></InputAdornment>,
                endAdornment: <InputAdornment position="end">% a.a.</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 50, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#1976d2' },
                  '&:hover fieldset': { borderColor: '#1976d2' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Crescimento conservador focado em dividendos
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Carteira Crescimento"
              type="number"
              value={(simulationParams.projecaoCrescimentoPatrimonio * 100).toFixed(1)}
              onChange={(e) => handleParamChange('projecaoCrescimentoPatrimonio', Number(e.target.value) / 100)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><TrendingUp size={16} /></InputAdornment>,
                endAdornment: <InputAdornment position="end">% a.a.</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 50, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#2e7d32' },
                  '&:hover fieldset': { borderColor: '#2e7d32' },
                  '&.Mui-focused fieldset': { borderColor: '#2e7d32' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Crescimento agressivo focado em valorização
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          {!canRunSimulation && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Adicione pelo menos um ativo a uma das carteiras para executar a simulação.
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={runSimulation}
            disabled={!canRunSimulation || isSimulating}
            startIcon={isSimulating ? <CircularProgress size={20} /> : <Play />}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #2e7d32 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1b5e20 90%)',
              },
            }}
          >
            {isSimulating ? 'Processando Simulação...' : 'Executar Simulação'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};