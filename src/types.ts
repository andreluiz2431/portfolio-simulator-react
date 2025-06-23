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
  id: string; // agora pode ser qualquer string
  nome: string;
  ativos: PortfolioAsset[];
  corTema: string;
}

// Simulation parameters
export interface SimulationParams {
  aporteMensal: number;
  periodoAnos: number;
  // Projeções por carteira, indexadas pelo id
  projecoesCarteiras: Record<string, number>; // ex: { carteiraId: 0.12 }
}

// Monthly simulation data point para múltiplas carteiras
export interface SimulationDataPoint {
  mes: number;
  patrimonio: Record<string, number>; // { [carteiraId]: valor }
  dividendosRecebidos: Record<string, number>; // { [carteiraId]: valor }
  totalAportado: Record<string, number>; // { [carteiraId]: valor }
}

// Complete simulation results para múltiplas carteiras
export interface SimulationResult {
  dadosMensais: SimulationDataPoint[];
  resumoFinal: Record<string, {
    patrimonioFinal: number;
    totalAportado: number;
    totalDividendos: number;
    rentabilidadeTotal: number;
  }>;
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