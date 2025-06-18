import { Asset, BrapiAssetResponse } from '../types';

const BRAPI_BASE_URL = import.meta.env.VITE_BRAPI_BASE_URL || 'https://brapi.dev/api';
const BRAPI_API_KEY = import.meta.env.VITE_BRAPI_API_KEY;

/**
 * Service for interacting with the Brapi API
 * Handles all API calls and data transformation with authentication
 */
export class BrapiApiService {
  /**
   * Searches for an asset by ticker symbol
   * @param ticker - The stock ticker symbol (e.g., 'PETR4', 'ITUB4')
   * @returns Promise<Asset> - Formatted asset data
   */
  static async searchAsset(ticker: string): Promise<Asset> {
    try {
      const cleanTicker = ticker.trim().toUpperCase();
      
      // Build URL with API key authentication
      const url = new URL(`${BRAPI_BASE_URL}/quote/${cleanTicker}`);
      if (BRAPI_API_KEY) {
        url.searchParams.append('token', BRAPI_API_KEY);
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API key inválida ou expirada');
        } else if (response.status === 404) {
          throw new Error('Ativo não encontrado');
        } else if (response.status === 429) {
          throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos');
        }
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }
      
      const data: BrapiAssetResponse = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error('Ativo não encontrado na B3');
      }
      
      const apiAsset = data.results[0];
      
      // Validate essential data
      if (!apiAsset.regularMarketPrice || apiAsset.regularMarketPrice <= 0) {
        throw new Error('Dados de preço inválidos para este ativo');
      }
      
      // Transform API response to internal Asset format
      const asset: Asset = {
        ticker: apiAsset.symbol,
        nome: apiAsset.longName || apiAsset.shortName || apiAsset.symbol,
        precoAtual: apiAsset.regularMarketPrice,
        dividendYieldAnual: apiAsset.dividendYield ? Math.abs(apiAsset.dividendYield) / 100 : 0,
        currency: apiAsset.currency || 'BRL',
        marketCap: apiAsset.marketCap,
        logoUrl: apiAsset.logourl
      };
      
      return asset;
    } catch (error) {
      console.error('Error fetching asset data:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Falha ao buscar dados do ativo. Verifique sua conexão e tente novamente.');
    }
  }

  /**
   * Searches for multiple assets in batch
   * @param tickers - Array of ticker symbols
   * @returns Promise<Asset[]> - Array of formatted asset data
   */
  static async searchMultipleAssets(tickers: string[]): Promise<Asset[]> {
    try {
      const cleanTickers = tickers.map(t => t.trim().toUpperCase()).join(',');
      
      const url = new URL(`${BRAPI_BASE_URL}/quote/${cleanTickers}`);
      if (BRAPI_API_KEY) {
        url.searchParams.append('token', BRAPI_API_KEY);
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro na busca múltipla: ${response.status}`);
      }
      
      const data: BrapiAssetResponse = await response.json();
      
      return data.results.map(apiAsset => ({
        ticker: apiAsset.symbol,
        nome: apiAsset.longName || apiAsset.shortName || apiAsset.symbol,
        precoAtual: apiAsset.regularMarketPrice || 0,
        dividendYieldAnual: apiAsset.dividendYield ? Math.abs(apiAsset.dividendYield) / 100 : 0,
        currency: apiAsset.currency || 'BRL',
        marketCap: apiAsset.marketCap,
        logoUrl: apiAsset.logourl
      }));
    } catch (error) {
      console.error('Error fetching multiple assets:', error);
      throw new Error('Falha ao buscar múltiplos ativos');
    }
  }

  /**
   * Validates if a ticker format is potentially valid for Brazilian market
   * @param ticker - The ticker to validate
   * @returns boolean - Whether the ticker format is valid
   */
  static isValidTickerFormat(ticker: string): boolean {
    const cleanTicker = ticker.trim().toUpperCase();
    // Brazilian stocks: 4 letters + 1-2 numbers (PETR4, MXRF11)
    // Brazilian stocks can also have 5-6 letters + numbers (BBAS3, ITUB4)
    return /^[A-Z]{4,6}[0-9]{1,2}[A-Z]?$/.test(cleanTicker);
  }

  /**
   * Gets API status and remaining quota
   * @returns Promise with API status information
   */
  static async getApiStatus(): Promise<{ status: string; quotaUsed?: number; quotaLimit?: number }> {
    try {
      const url = new URL(`${BRAPI_BASE_URL}/available`);
      if (BRAPI_API_KEY) {
        url.searchParams.append('token', BRAPI_API_KEY);
      }
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        return { status: 'error' };
      }
      
      const data = await response.json();
      return {
        status: 'ok',
        quotaUsed: response.headers.get('x-ratelimit-used') ? 
          parseInt(response.headers.get('x-ratelimit-used')!) : undefined,
        quotaLimit: response.headers.get('x-ratelimit-limit') ? 
          parseInt(response.headers.get('x-ratelimit-limit')!) : undefined,
      };
    } catch (error) {
      console.error('Error checking API status:', error);
      return { status: 'error' };
    }
  }
}