import axios, { AxiosResponse } from 'axios';

const FUNDAMENT_BASE_URL: string = import.meta.env.VITE_FUNDAMENT_BASE_URL;

interface FundamentResponse {
  dy: string | null;
}

/**
 * Busca o Dividend Yield (DY) de um papel usando a API local do Fundamentus
 * @param ticker - Ex: 'MXRF11', 'BBAS3'
 * @returns DY como string (ex: '12,0%') ou null se não encontrado
 */
export async function getDividendYield(ticker: string): Promise<string | null> {
  try {
    const res: AxiosResponse<FundamentResponse> = await axios.get(`${FUNDAMENT_BASE_URL}/dy/${ticker.toUpperCase()}`);
    console.log('Resposta Fundamentus:', res.data);
    return res.data.dy || null;
  } catch (error) {
    console.error('Erro ao buscar DY do Fundamentus:', error);
    return null;
  }
}

// Exemplo de uso:
// getDividendYield('MXRF11').then(console.log);