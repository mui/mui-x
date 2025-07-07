import { imageMimeTypes } from './utils/imageMimeTypes';
import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const elGRLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Φόρτωση δεδομένων…',
  noData: 'Δεν υπάρχουν δεδομένα για εμφάνιση',

  // Toolbar
  zoomIn: 'Μεγέθυνση',
  zoomOut: 'Σμίκρυνση',
  toolbarExport: 'Εξαγωγή',

  // Toolbar Export Menu
  toolbarExportPrint: 'Εκτύπωση',
  toolbarExportImage: (mimeType) => `Εξαγωγή ως ${imageMimeTypes[mimeType] ?? mimeType}`,
};

export const elGR = getChartsLocalization(elGRLocaleText);
