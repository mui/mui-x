import { imageMimeTypes } from './utils/imageMimeTypes';
import { type ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const nbNOLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Laster data…',
  noData: 'Ingen data å vise',

  // Toolbar
  zoomIn: 'Zoom inn',
  zoomOut: 'Zoom ut',
  toolbarExport: 'Eksporter',

  // Toolbar Export Menu
  toolbarExportPrint: 'Skriv ut',
  toolbarExportImage: (mimeType) => `Eksporter som ${imageMimeTypes[mimeType] ?? mimeType}`,

  // Charts renderer configuration
  chartTypeBar: 'Stolpe',
  chartTypeColumn: 'Kolonne',
  chartTypeLine: 'Linje',
  chartTypeArea: 'Område',
  chartTypePie: 'Kake',
  chartPaletteLabel: 'Fargepalett',
  chartPaletteNameRainbowSurge: 'Regnbuebølge',
  chartPaletteNameBlueberryTwilight: 'Blåbærskumring',
  chartPaletteNameMangoFusion: 'Mango Fusion',
  chartPaletteNameCheerfulFiesta: 'Munter Fiesta',
  chartPaletteNameStrawberrySky: 'Jordbærhimmel',
  chartPaletteNameBlue: 'Blå',
  chartPaletteNameGreen: 'Grønn',
  chartPaletteNamePurple: 'Lilla',
  chartPaletteNameRed: 'Rød',
  chartPaletteNameOrange: 'Oransje',
  chartPaletteNameYellow: 'Gul',
  chartPaletteNameCyan: 'Cyan',
  chartPaletteNamePink: 'Rosa',
  chartConfigurationSectionChart: 'Diagram',
  chartConfigurationSectionColumns: 'Kolonner',
  chartConfigurationSectionBars: 'Stolper',
  chartConfigurationSectionAxes: 'Akser',
  chartConfigurationGrid: 'Rutenett',
  chartConfigurationBorderRadius: 'Kantradius',
  chartConfigurationCategoryGapRatio: 'Kategorigapforhold',
  chartConfigurationBarGapRatio: 'Seriegapforhold',
  chartConfigurationStacked: 'Stablet',
  chartConfigurationShowToolbar: 'Vis verktøylinje',
  chartConfigurationSkipAnimation: 'Hopp over animasjon',
  chartConfigurationInnerRadius: 'Indre radius',
  chartConfigurationOuterRadius: 'Ytre radius',
  chartConfigurationColors: 'Farger',
  chartConfigurationHideLegend: 'Skjul forklaring',
  chartConfigurationShowMark: 'Vis merke',
  chartConfigurationHeight: 'Høyde',
  chartConfigurationWidth: 'Bredde',
  chartConfigurationSeriesGap: 'Serie gap',
  chartConfigurationTickPlacement: 'Hakeplassering',
  chartConfigurationTickLabelPlacement: 'Hakeetikett plassering',
  chartConfigurationCategoriesAxisLabel: 'Kategori akseetikett',
  chartConfigurationSeriesAxisLabel: 'Serie akseetikett',
  chartConfigurationXAxisPosition: 'X-akse posisjon',
  chartConfigurationYAxisPosition: 'Y-akse posisjon',
  chartConfigurationSeriesAxisReverse: 'Snu serieakse',
  chartConfigurationTooltipPlacement: 'Plassering',
  chartConfigurationTooltipTrigger: 'Utløser',
  chartConfigurationLegendPosition: 'Posisjon',
  chartConfigurationLegendDirection: 'Retning',
  chartConfigurationBarLabels: 'Stolpeetiketter',
  chartConfigurationColumnLabels: 'Kolonneetiketter',
  chartConfigurationInterpolation: 'Interpolasjon',
  chartConfigurationSectionTooltip: 'Informasjonsboks',
  chartConfigurationSectionLegend: 'Diagramforklaring',
  chartConfigurationSectionLines: 'Linjer',
  chartConfigurationSectionAreas: 'Områder',
  chartConfigurationSectionArcs: 'Buer',
  chartConfigurationPaddingAngle: 'Polstringsvinkel',
  chartConfigurationCornerRadius: 'Hjørneradius',
  chartConfigurationArcLabels: 'Bueetiketter',
  chartConfigurationStartAngle: 'Startvinkel',
  chartConfigurationEndAngle: 'Sluttvinkel',
  chartConfigurationPieTooltipTrigger: 'Utløser',
  chartConfigurationPieLegendPosition: 'Posisjon',
  chartConfigurationPieLegendDirection: 'Retning',

  // Common option labels
  chartConfigurationOptionNone: 'Ingen',
  chartConfigurationOptionValue: 'Verdi',
  chartConfigurationOptionAuto: 'Automatisk',
  chartConfigurationOptionTop: 'Topp',
  chartConfigurationOptionTopLeft: 'Topp Venstre',
  chartConfigurationOptionTopRight: 'Topp Høyre',
  chartConfigurationOptionBottom: 'Bunn',
  chartConfigurationOptionBottomLeft: 'Bunn Venstre',
  chartConfigurationOptionBottomRight: 'Bunn Høyre',
  chartConfigurationOptionLeft: 'Venstre',
  chartConfigurationOptionRight: 'Høyre',
  chartConfigurationOptionAxis: 'Akse',
  chartConfigurationOptionItem: 'Artikkel',
  chartConfigurationOptionHorizontal: 'Horisontal',
  chartConfigurationOptionVertical: 'Vertikal',
  chartConfigurationOptionBoth: 'Begge',
  chartConfigurationOptionStart: 'Start',
  chartConfigurationOptionMiddle: 'Midten',
  chartConfigurationOptionEnd: 'Slutt',
  chartConfigurationOptionExtremities: 'Ekstremiteter',
  chartConfigurationOptionTick: 'Hake',
  chartConfigurationOptionMonotoneX: 'Monoton X',
  chartConfigurationOptionMonotoneY: 'Monoton Y',
  chartConfigurationOptionCatmullRom: 'Catmull-Rom',
  chartConfigurationOptionLinear: 'Lineær',
  chartConfigurationOptionNatural: 'Naturlig',
  chartConfigurationOptionStep: 'Steg',
  chartConfigurationOptionStepBefore: 'Steg Før',
  chartConfigurationOptionStepAfter: 'Steg Etter',
  chartConfigurationOptionBumpX: 'Dunke X',
  chartConfigurationOptionBumpY: 'Dunke Y',

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
  //   formattedDate,
  //   seriesLabel
  // }) {
  //   const hasValues = open !== null && high !== null && low !== null && close !== null;
  //   return [formattedDate, seriesLabel, hasValues ? `Open: ${open}, High: ${high}, Low: ${low}, Close: ${close}` : this.a11yNoValue].filter(Boolean).join(this.a11yConnector);
  // },
};

export const nbNO = getChartsLocalization(nbNOLocaleText);
