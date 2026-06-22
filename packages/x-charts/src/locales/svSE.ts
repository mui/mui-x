import { imageMimeTypes } from './utils/imageMimeTypes';
import { type ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const svSELocaleText: Partial<ChartsLocaleText> = {
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
  // chartConfigurationSectionChart: 'Chart',
  // chartConfigurationSectionColumns: 'Columns',
  // chartConfigurationSectionBars: 'Bars',
  // chartConfigurationSectionAxes: 'Axes',
  // chartConfigurationGrid: 'Grid',
  // chartConfigurationBorderRadius: 'Border radius',
  // chartConfigurationCategoryGapRatio: 'Category gap ratio',
  // chartConfigurationBarGapRatio: 'Series gap ratio',
  // chartConfigurationStacked: 'Stacked',
  // chartConfigurationShowToolbar: 'Show toolbar',
  // chartConfigurationSkipAnimation: 'Skip animation',
  // chartConfigurationInnerRadius: 'Inner radius',
  // chartConfigurationOuterRadius: 'Outer radius',
  // chartConfigurationColors: 'Colors',
  // chartConfigurationHideLegend: 'Hide legend',
  // chartConfigurationShowMark: 'Show mark',
  // chartConfigurationHeight: 'Height',
  // chartConfigurationWidth: 'Width',
  // chartConfigurationSeriesGap: 'Series gap',
  // chartConfigurationTickPlacement: 'Tick placement',
  // chartConfigurationTickLabelPlacement: 'Tick label placement',
  // chartConfigurationCategoriesAxisLabel: 'Categories axis label',
  // chartConfigurationSeriesAxisLabel: 'Series axis label',
  // chartConfigurationXAxisPosition: 'X-axis position',
  // chartConfigurationYAxisPosition: 'Y-axis position',
  // chartConfigurationSeriesAxisReverse: 'Reverse series axis',
  // chartConfigurationTooltipPlacement: 'Placement',
  // chartConfigurationTooltipTrigger: 'Trigger',
  // chartConfigurationLegendPosition: 'Position',
  // chartConfigurationLegendDirection: 'Direction',
  // chartConfigurationBarLabels: 'Bar labels',
  // chartConfigurationColumnLabels: 'Column labels',
  // chartConfigurationInterpolation: 'Interpolation',
  // chartConfigurationSectionTooltip: 'Tooltip',
  // chartConfigurationSectionLegend: 'Legend',
  // chartConfigurationSectionLines: 'Lines',
  // chartConfigurationSectionAreas: 'Areas',
  // chartConfigurationSectionArcs: 'Arcs',
  // chartConfigurationPaddingAngle: 'Padding angle',
  // chartConfigurationCornerRadius: 'Corner radius',
  // chartConfigurationArcLabels: 'Arc labels',
  // chartConfigurationStartAngle: 'Start angle',
  // chartConfigurationEndAngle: 'End angle',
  // chartConfigurationPieTooltipTrigger: 'Trigger',
  // chartConfigurationPieLegendPosition: 'Position',
  // chartConfigurationPieLegendDirection: 'Direction',

  // Common option labels
  // chartConfigurationOptionNone: 'None',
  // chartConfigurationOptionValue: 'Value',
  // chartConfigurationOptionAuto: 'Auto',
  // chartConfigurationOptionTop: 'Top',
  // chartConfigurationOptionTopLeft: 'Top Left',
  // chartConfigurationOptionTopRight: 'Top Right',
  // chartConfigurationOptionBottom: 'Bottom',
  // chartConfigurationOptionBottomLeft: 'Bottom Left',
  // chartConfigurationOptionBottomRight: 'Bottom Right',
  // chartConfigurationOptionLeft: 'Left',
  // chartConfigurationOptionRight: 'Right',
  // chartConfigurationOptionAxis: 'Axis',
  // chartConfigurationOptionItem: 'Item',
  // chartConfigurationOptionHorizontal: 'Horizontal',
  // chartConfigurationOptionVertical: 'Vertical',
  // chartConfigurationOptionBoth: 'Both',
  // chartConfigurationOptionStart: 'Start',
  // chartConfigurationOptionMiddle: 'Middle',
  // chartConfigurationOptionEnd: 'End',
  // chartConfigurationOptionExtremities: 'Extremities',
  // chartConfigurationOptionTick: 'Tick',
  // chartConfigurationOptionMonotoneX: 'Monotone X',
  // chartConfigurationOptionMonotoneY: 'Monotone Y',
  // chartConfigurationOptionCatmullRom: 'Catmull-Rom',
  // chartConfigurationOptionLinear: 'Linear',
  // chartConfigurationOptionNatural: 'Natural',
  // chartConfigurationOptionStep: 'Step',
  // chartConfigurationOptionStepBefore: 'Step Before',
  // chartConfigurationOptionStepAfter: 'Step After',
  // chartConfigurationOptionBumpX: 'Bump X',
  // chartConfigurationOptionBumpY: 'Bump Y',

  // OHLC/Candlestick
  // open: 'Open',
  // high: 'High',
  // low: 'Low',
  // close: 'Close',

  // Accessibility descriptions
  // a11yNoValue: 'no value',
  // a11yConnector: '; ',
  // barDescription: function barDescription({
  //   value,
  //   formattedValue,
  //   formattedCategoryValue,
  //   seriesLabel
  // }) {
  //   return [formattedCategoryValue, seriesLabel, value === null ? this.a11yNoValue : formattedValue].filter(Boolean).join(this.a11yConnector);
  // },
  // lineDescription: function lineDescription({
  //   y,
  //   formattedXValue,
  //   formattedYValue,
  //   seriesLabel
  // }) {
  //   return [formattedXValue, seriesLabel, y === null ? this.a11yNoValue : formattedYValue].filter(Boolean).join(this.a11yConnector);
  // },
  // scatterDescription: function scatterDescription({
  //   formattedXValue,
  //   formattedYValue,
  //   seriesLabel
  // }) {
  //   return [seriesLabel, formattedXValue, formattedYValue].filter(Boolean).join(this.a11yConnector);
  // },
  // pieDescription: function pieDescription({
  //   value,
  //   formattedValue,
  //   seriesLabel
  // }) {
  //   return [seriesLabel, value === null ? this.a11yNoValue : formattedValue].filter(Boolean).join(this.a11yConnector);
  // },
  // radarDescription: function radarDescription({
  //   value,
  //   formattedValue,
  //   formattedCategoryValue,
  //   seriesLabel
  // }) {
  //   return [formattedCategoryValue, seriesLabel, value === null ? this.a11yNoValue : formattedValue].filter(Boolean).join(this.a11yConnector);
  // },
  // funnelDescription: function funnelDescription({
  //   value,
  //   formattedValue,
  //   seriesLabel
  // }) {
  //   return [seriesLabel, value === null ? this.a11yNoValue : formattedValue].filter(Boolean).join(this.a11yConnector);
  // },
  // heatmapDescription: function heatmapDescription({
  //   value,
  //   formattedValue,
  //   formattedXValue,
  //   formattedYValue
  // }) {
  //   return [formattedXValue, formattedYValue, value === null ? this.a11yNoValue : formattedValue].filter(Boolean).join(this.a11yConnector);
  // },
  // sankeyNodeDescription: function sankeyNodeDescription({
  //   formattedValue,
  //   nodeLabel
  // }) {
  //   return [nodeLabel, formattedValue].filter(Boolean).join(this.a11yConnector);
  // },
  // sankeyLinkDescription: function sankeyLinkDescription({
  //   formattedValue,
  //   sourceLabel,
  //   targetLabel
  // }) {
  //   return [sourceLabel && targetLabel ? `${sourceLabel} to ${targetLabel}` : sourceLabel ?? targetLabel, formattedValue].filter(Boolean).join(this.a11yConnector);
  // },
  // rangeBarDescription: function rangeBarDescription({
  //   value,
  //   formattedValue,
  //   formattedCategoryValue,
  //   seriesLabel
  // }) {
  //   return [formattedCategoryValue, seriesLabel, value === null ? this.a11yNoValue : formattedValue].filter(Boolean).join(this.a11yConnector);
  // },
  // ohlcDescription: function ohlcDescription({
  //   open,
  //   high,
  //   low,
  //   close,
  //   formattedOpen,
  //   formattedHigh,
  //   formattedLow,
  //   formattedClose,
  //   formattedDate,
  //   seriesLabel
  // }) {
  //   const hasValues = open !== null && high !== null && low !== null && close !== null;
  //   return [formattedDate, seriesLabel, hasValues ? `Open: ${formattedOpen ?? open}, High: ${formattedHigh ?? high}, Low: ${formattedLow ?? low}, Close: ${formattedClose ?? close}` : this.a11yNoValue].filter(Boolean).join(this.a11yConnector);
  // },
};

export const svSE = getChartsLocalization(svSELocaleText);
