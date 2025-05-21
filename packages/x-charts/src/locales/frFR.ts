import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const frFRLocalText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Chargement…',
  noData: 'Pas de données',
  // zoomIn: 'Zoom in',
  // zoomOut: 'Zoom out',
};

export const frFR = getChartsLocalization(frFRLocalText);
