import { imageMimeTypes } from './utils/imageMimeTypes';
import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const ptBRLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Carregando dados…',
  noData: 'Sem dados para exibir',

  // Toolbar
  zoomIn: 'Aumentar zoom',
  zoomOut: 'Diminuir zoom',
  toolbarExport: 'Exportar',

  // Toolbar Export Menu
  toolbarExportPrint: 'Imprimir',
  toolbarExportImage: (mimeType) => `Exportar como ${imageMimeTypes[mimeType] ?? mimeType}`,

  // Charts renderer configuration
  // chartTypeBar: 'Bar',
  // chartTypeColumn: 'Column',
  // chartTypeLine: 'Line',
  // chartTypeArea: 'Area',
  // chartTypePie: 'Pie',
  // chartPaletteLabel: 'Color palette',
  // chartPaletteNameRainbowSurge: 'Rainbow Surge',
  // chartPaletteNameBlueberryTwilight: 'Blueberry Twilight',
  // chartPaletteNameMangoFusion: 'Mango Fusion',
  // chartPaletteNameCheerfulFiesta: 'Cheerful Fiesta',
  // chartPaletteNameStrawberrySky: 'Strawberry Sky',
  // chartPaletteNameBlue: 'Blue',
  // chartPaletteNameGreen: 'Green',
  // chartPaletteNamePurple: 'Purple',
  // chartPaletteNameRed: 'Red',
  // chartPaletteNameOrange: 'Orange',
  // chartPaletteNameYellow: 'Yellow',
  // chartPaletteNameCyan: 'Cyan',
  // chartPaletteNamePink: 'Pink',
  // chartConfigurationSectionMain: 'Main section',
  // chartConfigurationSectionChart: 'Chart',
  // chartConfigurationSectionColumns: 'Columns',
  // chartConfigurationSectionBars: 'Bars',
  // chartConfigurationGrid: 'Grid',
  // chartConfigurationGridHorizontal: 'Horizontal',
  // chartConfigurationGridVertical: 'Vertical',
  // chartConfigurationGridBoth: 'Both',
  // chartConfigurationGridNone: 'None',
  // chartConfigurationBorderRadius: 'Border radius',
  // chartConfigurationCategoryGapRatio: 'Category gap ratio',
  // chartConfigurationBarGapRatio: 'Series gap ratio',
  // chartConfigurationStacked: 'Stacked',
  // chartConfigurationSkipAnimation: 'Skip animation',
  // chartConfigurationInnerRadius: 'Inner radius',
  // chartConfigurationOuterRadius: 'Outer radius',
  // chartConfigurationColors: 'Colors',
  // chartConfigurationHideLegend: 'Hide legend',
  // chartConfigurationHeight: 'Height',
  // chartConfigurationWidth: 'Width',
  // chartConfigurationSeriesGap: 'Series gap',
  // chartConfigurationTickPlacement: 'Tick placement',
  // chartConfigurationTickPlacementStart: 'Start',
  // chartConfigurationTickPlacementMiddle: 'Middle',
  // chartConfigurationTickPlacementEnd: 'End',
  // chartConfigurationTickPlacementExtremities: 'Extremities',
  // chartConfigurationTickLabelPlacement: 'Tick label placement',
  // chartConfigurationTickLabelPlacementTick: 'Tick',
  // chartConfigurationTickLabelPlacementMiddle: 'Middle',
};

export const ptBR = getChartsLocalization(ptBRLocaleText);
