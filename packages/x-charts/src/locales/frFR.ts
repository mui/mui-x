import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

const frFRCharts: Partial<ChartsLocaleText> = {
  // No group
  loading: 'Chargement…',
  noData: 'Pas de données',
};

export const frFR = getChartsLocalization(frFRCharts);
