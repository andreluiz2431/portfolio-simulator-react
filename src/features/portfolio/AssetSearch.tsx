import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Search, Plus, TrendingUp, DollarSign, Info } from 'lucide-react';
import { BrapiApiService } from '../../services/brapiApi';
import { usePortfolioStore } from '../../stores/portfolioStore';

interface AssetSearchProps {
  onAssetSelect: (assetTicker: string, portfolioId: string) => void;
}

export const AssetSearch: React.FC<AssetSearchProps> = ({ onAssetSelect }) => {
  const [quantidade, setQuantidade] = useState<number>(100);
  const [selectedPortfolio, setSelectedPortfolio] = useState<'dividendos' | 'crescimento'>('dividendos');
  
  const {
    assetSearch,
    setAssetSearchState,
    resetAssetSearch,
    addAsset,
    addAssetToPortfolio,
  } = usePortfolioStore();

  const handleSearch = async () => {
    if (!assetSearch.searchTerm.trim()) return;

    // Validate ticker format
    if (!BrapiApiService.isValidTickerFormat(assetSearch.searchTerm)) {
      setAssetSearchState({
        error: 'Formato de ticker inválido. Use o formato correto (ex: PETR4, ITUB4, MXRF11)',
      });
      return;
    }

    setAssetSearchState({ isLoading: true, error: null });

    try {
      const asset = await BrapiApiService.searchAsset(assetSearch.searchTerm);
      addAsset(asset);
      setAssetSearchState({ 
        searchResult: asset, 
        isLoading: false 
      });
    } catch (error) {
      setAssetSearchState({
        error: error instanceof Error ? error.message : 'Erro ao buscar ativo',
        isLoading: false,
        searchResult: null,
      });
    }
  };

  const handleAddToPortfolio = () => {
    if (assetSearch.searchResult && quantidade > 0) {
      addAssetToPortfolio(selectedPortfolio, assetSearch.searchResult.ticker, quantidade);
      onAssetSelect(assetSearch.searchResult.ticker, selectedPortfolio);
      
      // Reset search state
      resetAssetSearch();
      setQuantidade(100);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <Card sx={{ mb: 3, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Search size={20} />
          Buscar Ativo B3
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Ticker do Ativo"
            placeholder="Ex: PETR4, ITUB4, MXRF11"
            value={assetSearch.searchTerm}
            onChange={(e) => setAssetSearchState({ searchTerm: e.target.value.toUpperCase() })}
            onKeyPress={handleKeyPress}
            sx={{ minWidth: 200 }}
            disabled={assetSearch.isLoading}
          />
          
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={assetSearch.isLoading || !assetSearch.searchTerm.trim()}
            startIcon={assetSearch.isLoading ? <CircularProgress size={20} /> : <Search />}
            sx={{ minHeight: 56 }}
          >
            {assetSearch.isLoading ? 'Buscando...' : 'Buscar'}
          </Button>
        </Box>

        {assetSearch.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {assetSearch.error}
          </Alert>
        )}

        {assetSearch.searchResult && (
          <Card sx={{ backgroundColor: 'white', border: '2px solid #4caf50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
                    {assetSearch.searchResult.ticker.slice(0, 2)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {assetSearch.searchResult.ticker}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {assetSearch.searchResult.nome}
                    </Typography>
                  </Box>
                </Box>
                
                <Chip
                  label="Encontrado"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                    <DollarSign size={24} color="#1976d2" style={{ marginBottom: 8 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {formatCurrency(assetSearch.searchResult.precoAtual)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Preço Atual
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                    <TrendingUp size={24} color="#2e7d32" style={{ marginBottom: 8 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                      {formatPercentage(assetSearch.searchResult.dividendYieldAnual)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dividend Yield
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Valor Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {formatCurrency(assetSearch.searchResult.precoAtual * quantidade)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Quantidade"
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                  sx={{ minWidth: 150 }}
                  inputProps={{ min: 1 }}
                />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={selectedPortfolio === 'dividendos' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedPortfolio('dividendos')}
                    sx={{ 
                      backgroundColor: selectedPortfolio === 'dividendos' ? '#1976d2' : 'transparent',
                      borderColor: '#1976d2',
                      color: selectedPortfolio === 'dividendos' ? 'white' : '#1976d2',
                    }}
                  >
                    Carteira Dividendos
                  </Button>
                  <Button
                    variant={selectedPortfolio === 'crescimento' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedPortfolio('crescimento')}
                    sx={{ 
                      backgroundColor: selectedPortfolio === 'crescimento' ? '#2e7d32' : 'transparent',
                      borderColor: '#2e7d32',
                      color: selectedPortfolio === 'crescimento' ? 'white' : '#2e7d32',
                    }}
                  >
                    Carteira Crescimento
                  </Button>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={handleAddToPortfolio}
                startIcon={<Plus />}
                sx={{
                  backgroundColor: selectedPortfolio === 'dividendos' ? '#1976d2' : '#2e7d32',
                  '&:hover': {
                    backgroundColor: selectedPortfolio === 'dividendos' ? '#1565c0' : '#1b5e20',
                  },
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Adicionar à {selectedPortfolio === 'dividendos' ? 'Carteira Dividendos' : 'Carteira Crescimento'}
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};