import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Divider } from '@mui/material';
import { Header } from './components/Header';
import { AssetSearch } from './features/portfolio/AssetSearch';
import { PortfolioView } from './features/portfolio/PortfolioView';
import { SimulationControls } from './features/simulation/SimulationControls';
import { DashboardView } from './features/dashboard/DashboardView';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2e7d32',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
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
});

function App() {
  const handleAssetSelect = (assetTicker: string, portfolioId: string) => {
    // This callback can be used for additional actions after asset selection
    console.log(`Asset ${assetTicker} added to ${portfolioId} portfolio`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Asset Search Section */}
            <AssetSearch onAssetSelect={handleAssetSelect} />
            
            {/* Portfolio Management Section */}
            <PortfolioView />
            
            <Divider sx={{ my: 2 }} />
            
            {/* Simulation Controls */}
            <SimulationControls />
            
            {/* Dashboard/Results Section */}
            <DashboardView />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;