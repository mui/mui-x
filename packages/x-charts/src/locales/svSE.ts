import { imageMimeTypes } from './utils/imageMimeTypes';
import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const svSELocaleText: ChartsLocaleText = {
  // Overlay
  loading: 'Laddar data…',
  noData: 'Inga data att visa',

  // Toolbar
  zoomIn: 'Zooma in',
  zoomOut: 'Zooma ut',
  toolbarExport: 'Exportera',

  // Toolbar Export Menu
  toolbarExportPrint: 'Skriv ut',
  toolbarExportImage: (mimeType) => `Exportera som ${imageMimeTypes[mimeType] ?? mimeType}`,
};

export const svSE = getChartsLocalization(svSELocaleText);
