import { create } from 'zustand';
import { Asset, Portfolio, PortfolioAsset, SimulationParams, SimulationResult, AssetSearchState } from '../types';

interface PortfolioStore {
  // Assets data
  assets: Record<string, Asset>;
  
  // Portfolios
  portfolios: Portfolio[];
  
  // Simulation parameters
  simulationParams: SimulationParams;
  
  // Simulation results
  simulationResult: SimulationResult | null;
  
  // UI State
  assetSearch: AssetSearchState;
  isSimulating: boolean;
  isLoading: boolean; // Add loading state
  
  // Actions
  addAsset: (asset: Asset) => void;
  addAssetToPortfolio: (portfolioId: string, assetTicker: string, quantidade: number) => void;
  removeAssetFromPortfolio: (portfolioId: string, assetTicker: string) => void;
  updateSimulationParams: (params: Partial<SimulationParams>) => void;
  runSimulation: () => void;
  setAssetSearchState: (state: Partial<AssetSearchState>) => void;
  resetAssetSearch: () => void;
  setLoading: (isLoading: boolean) => void; // Add loading action
  addPortfolio: (portfolio: Portfolio) => void;
  removePortfolio: (portfolioId: string) => void;
  saveSimulation: () => void;
  loadSimulation: () => void;
}

const initialPortfolios: Portfolio[] = [
  {
    id: 'dividendos',
    nome: 'Carteira Dividendos',
    ativos: [],
    corTema: '#1976d2',
  },
  {
    id: 'crescimento',
    nome: 'Carteira Crescimento',
    ativos: [],
    corTema: '#2e7d32',
  },
];

const initialSimulationParams: SimulationParams = {
  aporteMensal: 1000,
  periodoAnos: 10,
  projecoesCarteiras: {
    dividendos: 0.06,
    crescimento: 0.12,
  },
};

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  assets: {},
  portfolios: initialPortfolios,
  simulationParams: initialSimulationParams,
  simulationResult: null,
  assetSearch: {
    isLoading: false,
    error: null,
    searchTerm: '',
    searchResult: null,
  },
  isSimulating: false,
  isLoading: false,
  
  addAsset: (asset: Asset) => {
    set(state => ({
      assets: {
        ...state.assets,
        [asset.ticker]: asset,
      },
    }));
  },

  addAssetToPortfolio: (portfolioId: string, assetTicker: string, quantidade: number) => {
    const state = get();
    const asset = state.assets[assetTicker];
    
    if (!asset) return;

    set(state => ({
      portfolios: state.portfolios.map(portfolio => {
        if (portfolio.id === portfolioId) {
          const existingAssetIndex = portfolio.ativos.findIndex(
            a => a.assetTicker === assetTicker
          );
          
          if (existingAssetIndex >= 0) {
            // Update existing asset quantity
            const updatedAtivos = [...portfolio.ativos];
            updatedAtivos[existingAssetIndex] = {
              ...updatedAtivos[existingAssetIndex],
              quantidade: updatedAtivos[existingAssetIndex].quantidade + quantidade,
            };
            return { ...portfolio, ativos: updatedAtivos };
          } else {
            // Add new asset
            const newAsset: PortfolioAsset = {
              assetTicker,
              quantidade,
              valorTotalInicial: asset.precoAtual * quantidade,
            };
            return {
              ...portfolio,
              ativos: [...portfolio.ativos, newAsset],
            };
          }
        }
        return portfolio;
      }),
    }));
  },

  removeAssetFromPortfolio: (portfolioId: string, assetTicker: string) => {
    set(state => ({
      portfolios: state.portfolios.map(portfolio => {
        if (portfolio.id === portfolioId) {
          return {
            ...portfolio,
            ativos: portfolio.ativos.filter(a => a.assetTicker !== assetTicker),
          };
        }
        return portfolio;
      }),
    }));
  },

  updateSimulationParams: (params: Partial<SimulationParams>) => {
    set(state => ({
      simulationParams: { ...state.simulationParams, ...params },
    }));
  },

  runSimulation: () => {
    const state = get();
    set({ isSimulating: true });

    try {
      const result = simulatePortfolios(
        state.portfolios,
        state.assets,
        state.simulationParams
      );
      
      set({ simulationResult: result });
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      set({ isSimulating: false });
    }
  },

  setAssetSearchState: (newState: Partial<AssetSearchState>) => {
    set(state => ({
      assetSearch: { ...state.assetSearch, ...newState },
    }));
  },

  resetAssetSearch: () => {
    set({
      assetSearch: {
        isLoading: false,
        error: null,
        searchTerm: '',
        searchResult: null,
      },
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  addPortfolio: (portfolio: Portfolio) => {
    set(state => ({ portfolios: [...state.portfolios, portfolio] }));
    set(state => ({
      simulationParams: {
        ...state.simulationParams,
        projecoesCarteiras: {
          ...state.simulationParams.projecoesCarteiras,
          [portfolio.id]: 0.10, // valor default
        },
      },
    }));
  },

  removePortfolio: (portfolioId: string) => {
    set(state => ({
      portfolios: state.portfolios.filter(p => p.id !== portfolioId),
      simulationParams: {
        ...state.simulationParams,
        projecoesCarteiras: Object.fromEntries(
          Object.entries(state.simulationParams.projecoesCarteiras).filter(([id]) => id !== portfolioId)
        ),
      },
    }));
  },

  saveSimulation: () => {
    const state = get();
    const data = {
      portfolios: state.portfolios,
      simulationParams: state.simulationParams,
      assets: state.assets,
    };
    localStorage.setItem('portfolio-simulator-save', JSON.stringify(data));
  },
  loadSimulation: () => {
    const raw = localStorage.getItem('portfolio-simulator-save');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      set({
        portfolios: data.portfolios,
        simulationParams: data.simulationParams,
        assets: data.assets,
      });
    } catch (e) {
      // erro ao carregar
    }
  },
}));

/**
 * Core simulation engine - calculates portfolio performance month by month
 */
function simulatePortfolios(
  portfolios: Portfolio[],
  assets: Record<string, Asset>,
  params: SimulationParams
): SimulationResult {
  const totalMonths = params.periodoAnos * 12;
  const dadosMensais: any[] = [];
  
  // Initialize portfolio states
  const portfolioStates = portfolios.map(portfolio => ({
    id: portfolio.id,
    valorAtivos: calculateInitialPortfolioValue(portfolio, assets),
    caixa: 0,
    totalAportado: calculateInitialPortfolioValue(portfolio, assets),
    totalDividendos: 0,
    ativos: portfolio.ativos.map(ativo => ({
      ...ativo,
      valorAtual: assets[ativo.assetTicker].precoAtual * ativo.quantidade,
    })),
  }));

  // Monthly simulation
  for (let mes = 1; mes <= totalMonths; mes++) {
    portfolioStates.forEach(portfolio => {
      // Add monthly contribution
      portfolio.caixa += params.aporteMensal;
      portfolio.totalAportado += params.aporteMensal;
      
      // Calculate dividends
      const dividendosMes = portfolio.ativos.reduce((total, ativo) => {
        const asset = assets[ativo.assetTicker];
        const dividendoMensal = ativo.valorAtual * (asset.dividendYieldAnual / 12);
        return total + dividendoMensal;
      }, 0);
      
      portfolio.caixa += dividendosMes;
      portfolio.totalDividendos += dividendosMes;
      
      // Redistribute cash proportionally among assets
      if (portfolio.ativos.length > 0 && portfolio.caixa > 0) {
        const valorTotalAtivos = portfolio.ativos.reduce((sum, ativo) => sum + ativo.valorAtual, 0);
        
        portfolio.ativos.forEach(ativo => {
          const proporcao = valorTotalAtivos > 0 ? ativo.valorAtual / valorTotalAtivos : 1 / portfolio.ativos.length;
          const investimento = portfolio.caixa * proporcao;
          
          const asset = assets[ativo.assetTicker];
          const novasCotas = investimento / asset.precoAtual;
          ativo.quantidade += novasCotas;
        });
        
        portfolio.caixa = 0;
      }
      
      // Apply monthly growth
      const crescimentoMensal = params.projecoesCarteiras[portfolio.id]
        ? params.projecoesCarteiras[portfolio.id] / 12
        : 0.01; // valor default se não definido
      portfolio.ativos.forEach(ativo => {
        ativo.valorAtual *= (1 + crescimentoMensal);
      });
      
      // Update total portfolio value
      portfolio.valorAtivos = portfolio.ativos.reduce((sum, ativo) => sum + ativo.valorAtual, 0);
    });
    
    // Record monthly data para todas as carteiras
    const patrimonio: Record<string, number> = {};
    const dividendosRecebidos: Record<string, number> = {};
    const totalAportado: Record<string, number> = {};
    portfolioStates.forEach(p => {
      patrimonio[p.id] = p.valorAtivos;
      dividendosRecebidos[p.id] = p.totalDividendos;
      totalAportado[p.id] = p.totalAportado;
    });
    dadosMensais.push({ mes, patrimonio, dividendosRecebidos, totalAportado });
  }
  // Calculate final summary dinâmico
  const resumoFinal: Record<string, any> = {};
  portfolioStates.forEach(p => {
    resumoFinal[p.id] = {
      patrimonioFinal: p.valorAtivos,
      totalAportado: p.totalAportado,
      totalDividendos: p.totalDividendos,
      rentabilidadeTotal: ((p.valorAtivos - p.totalAportado) / p.totalAportado) * 100,
    };
  });
  return {
    dadosMensais,
    resumoFinal,
  };
}

function calculateInitialPortfolioValue(portfolio: Portfolio, assets: Record<string, Asset>): number {
  return portfolio.ativos.reduce((total, ativo) => {
    const asset = assets[ativo.assetTicker];
    return total + (asset?.precoAtual || 0) * ativo.quantidade;
  }, 0);
}