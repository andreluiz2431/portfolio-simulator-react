import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { AssetList } from './AssetList';
import { usePortfolioStore } from '../../stores/portfolioStore';

export const PortfolioView: React.FC = () => {
  const { portfolios, assets, removeAssetFromPortfolio } = usePortfolioStore();

  const handleRemoveAsset = (portfolioId: string, assetTicker: string) => {
    removeAssetFromPortfolio(portfolioId, assetTicker);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Suas Carteiras
      </Typography>
      
      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} md={6} key={portfolio.id}>
            <AssetList
              portfolio={portfolio}
              assets={assets}
              onRemoveAsset={(assetTicker) => handleRemoveAsset(portfolio.id, assetTicker)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};