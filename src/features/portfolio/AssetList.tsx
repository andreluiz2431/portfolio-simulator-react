import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import { Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { Portfolio, Asset } from '../../types';

interface AssetListProps {
  portfolio: Portfolio;
  assets: Record<string, Asset>;
  onRemoveAsset: (assetTicker: string) => void;
}

export const AssetList: React.FC<AssetListProps> = ({
  portfolio,
  assets,
  onRemoveAsset,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getTotalPortfolioValue = (): number => {
    return portfolio.ativos.reduce((total, ativo) => {
      const asset = assets[ativo.assetTicker];
      if (!asset) return total;
      return total + (asset.precoAtual * ativo.quantidade);
    }, 0);
  };

  const getAssetWeight = (assetValue: number): number => {
    const totalValue = getTotalPortfolioValue();
    return totalValue > 0 ? (assetValue / totalValue) * 100 : 0;
  };

  if (portfolio.ativos.length === 0) {
    return (
      <Card sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="h6" gutterBottom>
            Nenhum ativo adicionado
          </Typography>
          <Typography variant="body2">
            Use o campo de busca acima para adicionar ativos à carteira
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {portfolio.nome}
          </Typography>
          <Chip
            label={`${portfolio.ativos.length} ativos`}
            size="small"
            sx={{
              backgroundColor: portfolio.corTema,
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: portfolio.corTema }}>
          {formatCurrency(getTotalPortfolioValue())}
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <List dense>
          {portfolio.ativos.map((ativo, index) => {
            const asset = assets[ativo.assetTicker];
            if (!asset) return null;
            
            const assetValue = asset.precoAtual * ativo.quantidade;
            const weight = getAssetWeight(assetValue);
            
            return (
              <React.Fragment key={ativo.assetTicker}>
                <ListItem sx={{ px: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: portfolio.corTema,
                      width: 36,
                      height: 36,
                      mr: 2,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {asset.ticker.slice(0, 2)}
                  </Avatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {asset.ticker}
                        </Typography>
                        <Chip
                          label={`${weight.toFixed(1)}%`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {ativo.quantidade} cotas • {formatCurrency(asset.precoAtual)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DollarSign size={12} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {formatCurrency(assetValue)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUp size={12} />
                            <Typography variant="caption">
                              DY: {formatPercentage(asset.dividendYieldAnual)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveAsset(ativo.assetTicker)}
                      size="small"
                      sx={{ color: 'error.main' }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < portfolio.ativos.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};