import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const ptPTLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Carregando dados…',
  noData: 'Sem dados para mostrar',
  zoomIn: 'Aumentar zoom',
  zoomOut: 'Diminuir zoom',
};

export const ptPT = getChartsLocalization(ptPTLocaleText);
