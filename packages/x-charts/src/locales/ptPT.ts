import { imageMimeTypes } from './utils/imageMimeTypes';
import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const ptPTLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Carregando dados…',
  noData: 'Sem dados para mostrar',
  zoomIn: 'Aumentar zoom',
  zoomOut: 'Diminuir zoom',
  toolbarExport: 'Exportar',
  toolbarExportPrint: 'Imprimir',
  toolbarExportImage: (mimeType) =>
    `Exportar como ${imageMimeTypes[mimeType as keyof typeof imageMimeTypes] ?? mimeType}`,
};

export const ptPT = getChartsLocalization(ptPTLocaleText);
