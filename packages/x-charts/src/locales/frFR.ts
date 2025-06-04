import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const frFRLocalText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Chargement…',
  noData: 'Pas de données',

  // Toolbar
  // zoomIn: 'Zoom in',
  // zoomOut: 'Zoom out',

  // Toolbar Export
  // toolbarExport: 'Export',
  // toolbarExportPrint: 'Print',
  // toolbarExportImage: mimeType => `Export as ${imageMimeTypes[mimeType as keyof typeof imageMimeTypes] ?? mimeType}`,
};

export const frFR = getChartsLocalization(frFRLocalText);
