import axios from 'axios';

const FUNDAMENT_BASE_URL = import.meta.env.VITE_FUNDAMENT_BASE_URL;

/**
 * Busca o Dividend Yield (DY) de um papel usando a API local do Fundamentus
 * @param {string} ticker - Ex: 'MXRF11', 'BBAS3'
 * @returns {Promise<string|null>} - DY como string (ex: '12,0%') ou null se não encontrado
 */
export async function getDividendYield(ticker) {
  try {
    const res = await axios.get(`${FUNDAMENT_BASE_URL}/dy/${ticker.toUpperCase()}`);
    return res.data.dy || null;
  } catch (error) {
    console.error('Erro ao buscar DY do Fundamentus:', error);
    return null;
  }
}

// Exemplo de uso:
// getDividendYield('MXRF11').then(console.log); 