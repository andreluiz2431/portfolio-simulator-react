import { SimulationDataPoint } from '../../types';

export type PeriodoFiltro = 'mensal' | 'anual' | 'total';

// Agrupa os dados mensais por ano ou retorna mensal/total conforme o filtro
export function agruparDadosPorPeriodo(
  dadosMensais: SimulationDataPoint[],
  filtro: PeriodoFiltro
): SimulationDataPoint[] {
  if (filtro === 'mensal') {
    return dadosMensais;
  }

  if (filtro === 'anual') {
    const agrupado: Record<number, SimulationDataPoint> = {};
    dadosMensais.forEach((item) => {
      const ano = Math.floor((item.mes - 1) / 12) + 1;
      if (!agrupado[ano]) {
        agrupado[ano] = {
          mes: ano, // aqui "mes" representa o ano
          patrimonio: {},
          dividendosRecebidos: {},
          totalAportado: {},
        };
      }
      // Soma os valores de cada carteira
      for (const carteiraId in item.patrimonio) {
        agrupado[ano].patrimonio[carteiraId] =
          (agrupado[ano].patrimonio[carteiraId] || 0) + item.patrimonio[carteiraId];
        agrupado[ano].dividendosRecebidos[carteiraId] =
          (agrupado[ano].dividendosRecebidos[carteiraId] || 0) + item.dividendosRecebidos[carteiraId];
        agrupado[ano].totalAportado[carteiraId] =
          (agrupado[ano].totalAportado[carteiraId] || 0) + item.totalAportado[carteiraId];
      }
    });
    // Retorna um array ordenado por ano
    return Object.values(agrupado).sort((a, b) => a.mes - b.mes);
  }

  if (filtro === 'total') {
    // Consolida todos os dados em um único ponto
    const total: SimulationDataPoint = {
      mes: 1,
      patrimonio: {},
      dividendosRecebidos: {},
      totalAportado: {},
    };
    dadosMensais.forEach((item) => {
      for (const carteiraId in item.patrimonio) {
        total.patrimonio[carteiraId] =
          (total.patrimonio[carteiraId] || 0) + item.patrimonio[carteiraId];
        total.dividendosRecebidos[carteiraId] =
          (total.dividendosRecebidos[carteiraId] || 0) + item.dividendosRecebidos[carteiraId];
        total.totalAportado[carteiraId] =
          (total.totalAportado[carteiraId] || 0) + item.totalAportado[carteiraId];
      }
    });
    return [total];
  }

  return dadosMensais;
} 