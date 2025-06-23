import React, { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Divider } from '@mui/material';
import { Header } from './components/Header';
import { AssetSearch } from './features/portfolio/AssetSearch';
import { PortfolioView } from './features/portfolio/PortfolioView';
import { SimulationControls } from './features/simulation/SimulationControls';
import { DashboardView } from './features/dashboard/DashboardView';
import { PortfolioManager } from './features/portfolio/PortfolioManager';
import { SimulationPersistenceButtons } from './components/SimulationPersistenceButtons';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#2e7d32',
        },
        background: {
          default: mode === 'dark' ? '#181a1b' : '#fafafa',
          paper: mode === 'dark' ? '#23272a' : '#fff',
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              backgroundColor: mode === 'dark' ? '#23272a' : '#fff',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600,
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
              },
            },
          },
        },
      },
    }),
    [mode]
  );

  const handleToggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const handleAssetSelect = (assetTicker: string, portfolioId: string) => {
    // This callback can be used for additional actions after asset selection
    console.log(`Asset ${assetTicker} added to ${portfolioId} portfolio`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header mode={mode} onToggleTheme={handleToggleTheme} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SimulationPersistenceButtons />
            <PortfolioManager />
            <AssetSearch onAssetSelect={handleAssetSelect} />
            <PortfolioView />
            <Divider sx={{ my: 2 }} />
            <SimulationControls />
            <DashboardView />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;