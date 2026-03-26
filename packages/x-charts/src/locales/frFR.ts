import { type ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const frFRLocalText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Chargement…',
  noData: 'Pas de données',

  // Toolbar
  // zoomIn: 'Zoom in',
  // zoomOut: 'Zoom out',
  // toolbarExport: 'Export',

  // Toolbar Export Menu
  // toolbarExportPrint: 'Print',
  // toolbarExportImage: mimeType => `Export as ${imageMimeTypes[mimeType] ?? mimeType}`,

  // Charts renderer configuration
  chartTypeBar: 'Barre',
  chartTypeColumn: 'Colonne',
  chartTypeLine: 'Ligne',
  chartTypeArea: 'Aire',
  chartTypePie: 'Camembert',
  chartPaletteLabel: 'Palette de couleurs',
  chartPaletteNameRainbowSurge: 'Vague arc-en-ciel',
  chartPaletteNameBlueberryTwilight: 'Crépuscule myrtille',
  chartPaletteNameMangoFusion: 'Fusion mangue',
  chartPaletteNameCheerfulFiesta: 'Fiesta joyeuse',
  chartPaletteNameStrawberrySky: 'Ciel fraise',
  chartPaletteNameBlue: 'Bleu',
  chartPaletteNameGreen: 'Vert',
  chartPaletteNamePurple: 'Violet',
  chartPaletteNameRed: 'Rouge',
  chartPaletteNameOrange: 'Orange',
  chartPaletteNameYellow: 'Jaune',
  chartPaletteNameCyan: 'Cyan',
  chartPaletteNamePink: 'Rose',
  chartConfigurationSectionChart: 'Graphique',
  chartConfigurationSectionColumns: 'Colonnes',
  chartConfigurationSectionBars: 'Barres',
  chartConfigurationSectionAxes: 'Axes',
  chartConfigurationGrid: 'Grille',
  chartConfigurationBorderRadius: 'Rayon de bordure',
  chartConfigurationCategoryGapRatio: "Ratio d'espacement des catégories",
  chartConfigurationBarGapRatio: "Ratio d'espacement des séries",
  chartConfigurationStacked: 'Empilé',
  chartConfigurationShowToolbar: "Afficher la barre d'outils",
  chartConfigurationSkipAnimation: "Ignorer l'animation",
  chartConfigurationInnerRadius: 'Rayon intérieur',
  chartConfigurationOuterRadius: 'Rayon extérieur',
  chartConfigurationColors: 'Couleurs',
  chartConfigurationHideLegend: 'Masquer la légende',
  chartConfigurationShowMark: 'Afficher les marques',
  chartConfigurationHeight: 'Hauteur',
  chartConfigurationWidth: 'Largeur',
  chartConfigurationSeriesGap: 'Espacement des séries',
  chartConfigurationTickPlacement: 'Placement des graduations',
  chartConfigurationTickLabelPlacement: 'Placement des étiquettes',
  chartConfigurationCategoriesAxisLabel: "Étiquette de l'axe des catégories",
  chartConfigurationSeriesAxisLabel: "Étiquette de l'axe des séries",
  chartConfigurationXAxisPosition: "Position de l'axe X",
  chartConfigurationYAxisPosition: "Position de l'axe Y",
  chartConfigurationSeriesAxisReverse: "Inverser l'axe des séries",
  chartConfigurationTooltipPlacement: 'Placement',
  chartConfigurationTooltipTrigger: 'Déclencheur',
  chartConfigurationLegendPosition: 'Position',
  chartConfigurationLegendDirection: 'Direction',
  chartConfigurationBarLabels: 'Étiquettes des barres',
  chartConfigurationColumnLabels: 'Étiquettes des colonnes',
  chartConfigurationInterpolation: 'Interpolation',
  chartConfigurationSectionTooltip: 'Info-bulle',
  chartConfigurationSectionLegend: 'Légende',
  chartConfigurationSectionLines: 'Lignes',
  chartConfigurationSectionAreas: 'Aires',
  chartConfigurationSectionArcs: 'Arcs',
  chartConfigurationPaddingAngle: 'Angle de remplissage',
  chartConfigurationCornerRadius: 'Rayon des coins',
  chartConfigurationArcLabels: 'Étiquettes des arcs',
  chartConfigurationStartAngle: 'Angle de départ',
  chartConfigurationEndAngle: 'Angle de fin',
  chartConfigurationPieTooltipTrigger: 'Déclencheur',
  chartConfigurationPieLegendPosition: 'Position',
  chartConfigurationPieLegendDirection: 'Direction',

  // Common option labels
  chartConfigurationOptionNone: 'Aucun',
  chartConfigurationOptionValue: 'Valeur',
  chartConfigurationOptionAuto: 'Auto',
  chartConfigurationOptionTop: 'Haut',
  chartConfigurationOptionTopLeft: 'Haut à gauche',
  chartConfigurationOptionTopRight: 'Haut à droite',
  chartConfigurationOptionBottom: 'Bas',
  chartConfigurationOptionBottomLeft: 'Bas à gauche',
  chartConfigurationOptionBottomRight: 'Bas à droite',
  chartConfigurationOptionLeft: 'Gauche',
  chartConfigurationOptionRight: 'Droite',
  chartConfigurationOptionAxis: 'Axe',
  chartConfigurationOptionItem: 'Élément',
  chartConfigurationOptionHorizontal: 'Horizontal',
  chartConfigurationOptionVertical: 'Vertical',
  chartConfigurationOptionBoth: 'Les deux',
  chartConfigurationOptionStart: 'Début',
  chartConfigurationOptionMiddle: 'Milieu',
  chartConfigurationOptionEnd: 'Fin',
  chartConfigurationOptionExtremities: 'Extrémités',
  chartConfigurationOptionTick: 'Graduation',
  chartConfigurationOptionMonotoneX: 'Monotone X',
  chartConfigurationOptionMonotoneY: 'Monotone Y',
  chartConfigurationOptionCatmullRom: 'Catmull-Rom',
  chartConfigurationOptionLinear: 'Linéaire',
  chartConfigurationOptionNatural: 'Naturel',
  chartConfigurationOptionStep: 'Palier',
  chartConfigurationOptionStepBefore: 'Palier avant',
  chartConfigurationOptionStepAfter: 'Palier après',
  chartConfigurationOptionBumpX: 'Bosse X',
  chartConfigurationOptionBumpY: 'Bosse Y',

  // OHLC/Candlestick
  open: 'Ouvertue',
  high: 'Haut',
  low: 'Bas',
  close: 'Cloture',

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

export const frFR = getChartsLocalization(frFRLocalText);
