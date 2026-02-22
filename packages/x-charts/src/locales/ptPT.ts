import { imageMimeTypes } from './utils/imageMimeTypes';
import { type ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const ptPTLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Carregando dados…',
  noData: 'Sem dados para mostrar',

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
  // chartConfiguration: {
  //   section: { chart: 'Chart', columns: 'Columns', bars: 'Bars', axes: 'Axes' },
  //   grid: 'Grid', borderRadius: 'Border radius', categoryGapRatio: 'Category gap ratio',
  //   barGapRatio: 'Series gap ratio', stacked: 'Stacked', showToolbar: 'Show toolbar',
  //   skipAnimation: 'Skip animation', innerRadius: 'Inner radius', outerRadius: 'Outer radius',
  //   colors: 'Colors', hideLegend: 'Hide legend', showMark: 'Show mark', height: 'Height',
  //   width: 'Width', seriesGap: 'Series gap', tickPlacement: 'Tick placement',
  //   tickLabelPlacement: 'Tick label placement', categoriesAxisLabel: 'Categories axis label',
  //   seriesAxisLabel: 'Series axis label', xAxisPosition: 'X-axis position',
  //   yAxisPosition: 'Y-axis position', axisReverse: 'Reverse series axis',
  //   tooltipPlacement: 'Placement', tooltipTrigger: 'Trigger', legendPosition: 'Position',
  //   legendDirection: 'Direction', barLabels: 'Bar labels', columnLabels: 'Column labels',
  //   interpolation: 'Interpolation', sectionTooltip: 'Tooltip', sectionLegend: 'Legend',
  //   sectionLines: 'Lines', sectionAreas: 'Areas', sectionArcs: 'Arcs',
  //   paddingAngle: 'Padding angle', cornerRadius: 'Corner radius', arcLabels: 'Arc labels',
  //   startAngle: 'Start angle', endAngle: 'End angle', pieTooltipTrigger: 'Trigger',
  //   pieLegendPosition: 'Position', pieLegendDirection: 'Direction',
  //   option: {
  //     none: 'None', value: 'Value', auto: 'Auto', top: 'Top', topLeft: 'Top Left',
  //     topRight: 'Top Right', bottom: 'Bottom', bottomLeft: 'Bottom Left',
  //     bottomRight: 'Bottom Right', left: 'Left', right: 'Right', axis: 'Axis', item: 'Item',
  //     horizontal: 'Horizontal', vertical: 'Vertical', both: 'Both', start: 'Start',
  //     middle: 'Middle', end: 'End', extremities: 'Extremities', tick: 'Tick',
  //     monotoneX: 'Monotone X', monotoneY: 'Monotone Y', catmullRom: 'Catmull-Rom',
  //     linear: 'Linear', natural: 'Natural', step: 'Step', stepBefore: 'Step Before',
  //     stepAfter: 'Step After', bumpX: 'Bump X', bumpY: 'Bump Y',
  //   },
  // },
};

export const ptPT = getChartsLocalization(ptPTLocaleText);
