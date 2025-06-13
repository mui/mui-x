import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const ptBRLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Carregando dados…',
  noData: 'Sem dados para exibir',
  zoomIn: 'Aumentar zoom',
  zoomOut: 'Diminuir zoom',
};

export const ptBR = getChartsLocalization(ptBRLocaleText);
