import React, { useState } from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { Box, Card, CardContent, Typography, Button, TextField, Grid, IconButton, InputAdornment } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';

export const PortfolioManager: React.FC = () => {
  const { portfolios, addPortfolio, removePortfolio } = usePortfolioStore();
  const [nome, setNome] = useState('');
  const [corTema, setCorTema] = useState('#1976d2');

  const handleAdd = () => {
    if (!nome.trim()) return;
    const id = nome.trim().toLowerCase().replace(/\s+/g, '-');
    if (portfolios.some(p => p.id === id)) return;
    addPortfolio({ id, nome, ativos: [], corTema });
    setNome('');
    setCorTema('#1976d2');
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Gerenciar Carteiras
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              label="Nome da Carteira"
              value={nome}
              onChange={e => setNome(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={8} sm={5}>
            <TextField
              label="Cor do Tema"
              type="color"
              value={corTema}
              onChange={e => setCorTema(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">Cor:</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<Plus size={18} />} fullWidth>
              Adicionar
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {portfolios.map((p, idx) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <Card sx={{ borderLeft: `6px solid ${p.corTema}` }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{p.nome}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: {p.id}</Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => removePortfolio(p.id)}
                      disabled={portfolios.length <= 1}
                      size="small"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
