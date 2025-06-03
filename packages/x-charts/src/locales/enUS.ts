import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

// This object is not Partial<ChartsLocaleText> because it is the default values

export const enUSLocaleText: ChartsLocaleText = {
  // Overlay
  loading: 'Loading data…',
  noData: 'No data to display',

  // Toolbar
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',

  // Toolbar Export
  toolbarExport: 'Export',
  toolbarExportPrint: 'Print chart',
  toolbarExportPng: 'Export as PNG',
};

export const DEFAULT_LOCALE = enUSLocaleText;

export const enUS = getChartsLocalization(enUSLocaleText);
