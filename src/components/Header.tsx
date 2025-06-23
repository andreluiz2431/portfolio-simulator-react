import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip, IconButton, Tooltip } from '@mui/material';
import { TrendingUp, PieChart, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, onToggleTheme }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: mode === 'dark' ? '#181a1b' : '#1a1a1a', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: '12px',
            }}
          >
            <PieChart size={24} color="#64b5f6" />
            <Typography variant="h6" component="h1" sx={{ fontWeight: 700, color: '#fff' }}>
              Portfolio Simulator X
            </Typography>
          </Box>
          <Chip
            label="v2.0 API-Driven"
            size="small"
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              color: '#4caf50',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
            <IconButton color="inherit" onClick={onToggleTheme} size="large">
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
          </Tooltip>
          <TrendingUp size={20} color="#64b5f6" />
          <Typography variant="body2" sx={{ color: '#b0b0b0', fontWeight: 500 }}>
            Real-time B3 Market Data
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};