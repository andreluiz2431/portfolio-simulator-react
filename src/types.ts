// Asset data structure from Brapi API
export interface BrapiAssetResponse {
  results: Array<{
    symbol: string;
    longName?: string;
    shortName?: string;
    regularMarketPrice: number;
    dividendYield?: number;
    currency: string;
    marketCap?: number;
    logourl?: string;
  }>;
  requestedAt: string;
  took: string;
}

// Internal asset representation after API mapping
export interface Asset {
  ticker: string;
  nome: string;
  precoAtual: number;
  dividendYieldAnual: number; // Already in decimal format (0.085 for 8.5%)
  currency: string;
  marketCap?: number;
  logoUrl?: string;
}

// Asset within a portfolio with quantity
export interface PortfolioAsset {
  assetTicker: string;
  quantidade: number;
  valorTotalInicial: number; // Initial value when added
}

// Portfolio definition
export interface Portfolio {
  id: 'dividendos' | 'crescimento';
  nome: string;
  ativos: PortfolioAsset[];
  corTema: string;
}

// Simulation parameters
export interface SimulationParams {
  aporteMensal: number;
  periodoAnos: number;
  projecaoCrescimentoDividendos: number; // Decimal format (0.04 for 4%)
  projecaoCrescimentoPatrimonio: number; // Decimal format (0.12 for 12%)
}

// Monthly simulation data point
export interface SimulationDataPoint {
  mes: number;
  patrimonioDividendos: number;
  patrimonioCrescimento: number;
  dividendosRecebidosDividendos: number;
  dividendosRecebidosCrescimento: number;
  totalAportadoDividendos: number;
  totalAportadoCrescimento: number;
}

// Complete simulation results
export interface SimulationResult {
  dadosMensais: SimulationDataPoint[];
  resumoFinal: {
    dividendos: {
      patrimonioFinal: number;
      totalAportado: number;
      totalDividendos: number;
      rentabilidadeTotal: number;
    };
    crescimento: {
      patrimonioFinal: number;
      totalAportado: number;
      totalDividendos: number;
      rentabilidadeTotal: number;
    };
  };
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AssetSearchState extends LoadingState {
  searchTerm: string;
  searchResult: Asset | null;
}

// API Status interface
export interface ApiStatus {
  status: string;
  quotaUsed?: number;
  quotaLimit?: number;
}