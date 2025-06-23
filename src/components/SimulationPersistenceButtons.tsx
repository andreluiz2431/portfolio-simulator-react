import React from 'react';
import { Button, Stack } from '@mui/material';
import { Save, Upload } from 'lucide-react';
import { usePortfolioStore } from '../stores/portfolioStore';

export const SimulationPersistenceButtons: React.FC = () => {
  const { saveSimulation, loadSimulation } = usePortfolioStore();

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button variant="outlined" color="primary" startIcon={<Save />} onClick={saveSimulation}>
        Salvar Simulação
      </Button>
      <Button variant="outlined" color="secondary" startIcon={<Upload />} onClick={loadSimulation}>
        Carregar Simulação
      </Button>
    </Stack>
  );
};
