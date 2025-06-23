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
  const { portfolios, assetSearch, setAssetSearchState, resetAssetSearch, addAsset, addAssetToPortfolio } = usePortfolioStore();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>(portfolios[0]?.id || '');
  
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
    <Card sx={{ mb: 3, backgroundColor: (theme) => theme.palette.background.paper }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Search size={22} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Buscar Ativo
          </Typography>
        </Box>
        
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
          <Card sx={{ backgroundColor: (theme) => theme.palette.background.paper, border: '2px solid #4caf50' }}>
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
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: (theme) => theme.palette.action.hover, borderRadius: 2 }}>
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
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: (theme) => theme.palette.action.hover, borderRadius: 2 }}>
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
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: (theme) => theme.palette.action.hover, borderRadius: 2 }}>
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
                <TextField
                  select
                  label="Carteira"
                  value={selectedPortfolio}
                  onChange={e => setSelectedPortfolio(e.target.value)}
                  sx={{ minWidth: 180 }}
                  SelectProps={{ native: true }}
                >
                  {portfolios.map((p) => (
                    <option key={p.id} value={p.id} style={{ color: p.corTema }}>
                      {p.nome}
                    </option>
                  ))}
                </TextField>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddToPortfolio}
                startIcon={<Plus />}
                sx={{
                  backgroundColor: portfolios.find(p => p.id === selectedPortfolio)?.corTema || 'primary.main',
                  '&:hover': {
                    backgroundColor: portfolios.find(p => p.id === selectedPortfolio)?.corTema || 'primary.dark',
                  },
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Adicionar à {portfolios.find(p => p.id === selectedPortfolio)?.nome || 'Carteira'}
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};