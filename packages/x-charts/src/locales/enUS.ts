import { imageMimeTypes } from './utils/imageMimeTypes';
import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

// This object is not Partial<ChartsLocaleText> because it is the default values

export const enUSLocaleText: ChartsLocaleText = {
  /* Overlay */
  loading: 'Loading data…',
  noData: 'No data to display',

  /* Toolbar */
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  toolbarExport: 'Export',

  /* Toolbar Export Menu */
  toolbarExportPrint: 'Print',
  toolbarExportImage: (mimeType) => `Export as ${imageMimeTypes[mimeType] ?? mimeType}`,

  /* Charts renderer configuration */
  chartTypeBar: 'Bar',
  chartTypeColumn: 'Column',
  chartTypeLine: 'Line',
  chartTypeArea: 'Area',
  chartTypePie: 'Pie',
  chartPaletteLabel: 'Color palette',
  chartPaletteNameRainbowSurge: 'Rainbow Surge',
  chartPaletteNameBlueberryTwilight: 'Blueberry Twilight',
  chartPaletteNameMangoFusion: 'Mango Fusion',
  chartPaletteNameCheerfulFiesta: 'Cheerful Fiesta',
  chartPaletteNameStrawberrySky: 'Strawberry Sky',
  chartPaletteNameBlue: 'Blue',
  chartPaletteNameGreen: 'Green',
  chartPaletteNamePurple: 'Purple',
  chartPaletteNameRed: 'Red',
  chartPaletteNameOrange: 'Orange',
  chartPaletteNameYellow: 'Yellow',
  chartPaletteNameCyan: 'Cyan',
  chartPaletteNamePink: 'Pink',
  chartConfigurationSectionMain: 'Main section',
  chartConfigurationSectionChart: 'Chart',
  chartConfigurationSectionColumns: 'Columns',
  chartConfigurationSectionBars: 'Bars',
  chartConfigurationGrid: 'Grid',
  chartConfigurationGridHorizontal: 'Horizontal',
  chartConfigurationGridVertical: 'Vertical',
  chartConfigurationGridBoth: 'Both',
  chartConfigurationGridNone: 'None',
  chartConfigurationBorderRadius: 'Border radius',
  chartConfigurationCategoryGapRatio: 'Category gap ratio',
  chartConfigurationBarGapRatio: 'Series gap ratio',
  chartConfigurationStacked: 'Stacked',
  chartConfigurationSkipAnimation: 'Skip animation',
  chartConfigurationInnerRadius: 'Inner radius',
  chartConfigurationOuterRadius: 'Outer radius',
  chartConfigurationColors: 'Colors',
  chartConfigurationHideLegend: 'Hide legend',
  chartConfigurationShowMark: 'Show mark',
  chartConfigurationHeight: 'Height',
  chartConfigurationWidth: 'Width',
  chartConfigurationSeriesGap: 'Series gap',
  chartConfigurationTickPlacement: 'Tick placement',
  chartConfigurationTickPlacementStart: 'Start',
  chartConfigurationTickPlacementMiddle: 'Middle',
  chartConfigurationTickPlacementEnd: 'End',
  chartConfigurationTickPlacementExtremities: 'Extremities',
  chartConfigurationTickLabelPlacement: 'Tick label placement',
  chartConfigurationTickLabelPlacementTick: 'Tick',
  chartConfigurationTickLabelPlacementMiddle: 'Middle',
};

export const DEFAULT_LOCALE = enUSLocaleText;

export const enUS = getChartsLocalization(enUSLocaleText);
