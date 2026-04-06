import { imageMimeTypes } from './utils/imageMimeTypes';
import { type ChartsLocaleText } from './utils/chartsLocaleTextApi';
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

  // Charts renderer configuration
  chartTypeBar: 'Μπάρα',
  chartTypeColumn: 'Στήλη',
  chartTypeLine: 'Γραμμή',
  chartTypeArea: 'Περιοχή',
  chartTypePie: 'Πίτα',
  chartPaletteLabel: 'Παλέτα χρωμάτων',
  chartPaletteNameRainbowSurge: 'Έκρηξη Ουράνιου Τόξου',
  chartPaletteNameBlueberryTwilight: 'Λυκόφως Μύρτιλου',
  chartPaletteNameMangoFusion: 'Ένωση Μάνγκο',
  chartPaletteNameCheerfulFiesta: 'Χαρούμενη Γιορτή',
  chartPaletteNameStrawberrySky: 'Φραουλένιος Ουρανός',
  chartPaletteNameBlue: 'Μπλέ',
  chartPaletteNameGreen: 'Πράσινο',
  chartPaletteNamePurple: 'Μώβ',
  chartPaletteNameRed: 'Κόκκινο',
  chartPaletteNameOrange: 'Πορτοκαλί',
  chartPaletteNameYellow: 'Κίτρινο',
  chartPaletteNameCyan: 'Κυανό',
  chartPaletteNamePink: 'Ρόζ',
  chartConfigurationSectionChart: 'Γράφημα',
  chartConfigurationSectionColumns: 'Στήλες',
  chartConfigurationSectionBars: 'Μπάρες',
  chartConfigurationSectionAxes: 'Άξονες',
  chartConfigurationGrid: 'Πλέγμα',
  chartConfigurationBorderRadius: 'Ακτίνα περιγράμματος',
  chartConfigurationCategoryGapRatio: 'Λόγος κενών κατηγορίας',
  chartConfigurationBarGapRatio: 'Λόγος κενών Σειράς',
  chartConfigurationStacked: 'Στοίβαγμα',
  chartConfigurationShowToolbar: 'Εμφάνιση γραμμής εργαλείων',
  chartConfigurationSkipAnimation: 'Παράξειψη Animation',
  chartConfigurationInnerRadius: 'Εσωτερική ακτίνα',
  chartConfigurationOuterRadius: 'Εξωτερική ακτίνα',
  chartConfigurationColors: 'Χρώματα',
  chartConfigurationHideLegend: 'Απόκρυψη Υπομνήματος',
  chartConfigurationShowMark: 'Εμφάνιση Σημείωσης',
  chartConfigurationHeight: 'Ύψος',
  chartConfigurationWidth: 'Πλάτος',
  chartConfigurationSeriesGap: 'Κενό Σειράς',
  chartConfigurationTickPlacement: 'Τοποθέτηση Σημείων',
  chartConfigurationTickLabelPlacement: 'Τοποθέτηση Ετικετών Σημείων',
  chartConfigurationCategoriesAxisLabel: 'Ετικέτα άξονα κατηγοριών',
  chartConfigurationSeriesAxisLabel: 'Ετικέτα άξονα σειρών',
  chartConfigurationXAxisPosition: 'Θέση άξονα Χ',
  chartConfigurationYAxisPosition: 'Θέση άξονα Υ',
  chartConfigurationSeriesAxisReverse: 'Αντιστροφή άξονα σειρών',
  chartConfigurationTooltipPlacement: 'Τοποθέτηση',
  chartConfigurationTooltipTrigger: 'Τρόπος ενεργοποίησης του tooltip',
  chartConfigurationLegendPosition: 'Θέση',
  chartConfigurationLegendDirection: 'Κατεύθυνση',
  chartConfigurationBarLabels: 'Ετικέτες μπαρών',
  chartConfigurationColumnLabels: 'Ετικέτες στηλών',
  chartConfigurationInterpolation: 'Διαμεσολάβηση',
  chartConfigurationSectionTooltip: 'Tooltip',
  chartConfigurationSectionLegend: 'Υπόμνημα',
  chartConfigurationSectionLines: 'Γραμμές',
  chartConfigurationSectionAreas: 'Περιοχές',
  chartConfigurationSectionArcs: 'Τόξα',
  chartConfigurationPaddingAngle: 'Γωνία περιθωρίου',
  chartConfigurationCornerRadius: 'Ακτίνα γωνίας',
  chartConfigurationArcLabels: 'Ετικέτες τόξων',
  chartConfigurationStartAngle: 'Γωνία εκκίνησης',
  chartConfigurationEndAngle: 'Γωνία λήξης',
  chartConfigurationPieTooltipTrigger: 'Τρόπος ενεργοποίησης του tooltip',
  chartConfigurationPieLegendPosition: 'Θέση',
  chartConfigurationPieLegendDirection: 'Κατεύθυνση',

  // Common option labels
  chartConfigurationOptionNone: 'Κανένα',
  chartConfigurationOptionValue: 'Τιμή',
  chartConfigurationOptionAuto: 'Αυτόματο',
  chartConfigurationOptionTop: 'Πάνω',
  chartConfigurationOptionTopLeft: 'Πάνω Αριστερά',
  chartConfigurationOptionTopRight: 'Πάνω Δεξιά',
  chartConfigurationOptionBottom: 'Κάτω',
  chartConfigurationOptionBottomLeft: 'Κάτω Αριστερά',
  chartConfigurationOptionBottomRight: 'Κάτω Δεξιά',
  chartConfigurationOptionLeft: 'Αριστερά',
  chartConfigurationOptionRight: 'Δεξιά',
  chartConfigurationOptionAxis: 'Άξονας',
  chartConfigurationOptionItem: 'Στοιχείο',
  chartConfigurationOptionHorizontal: 'Οριζόντιο',
  chartConfigurationOptionVertical: 'Κάθετο',
  chartConfigurationOptionBoth: 'Και τα δύο',
  chartConfigurationOptionStart: 'Αρχή',
  chartConfigurationOptionMiddle: 'Κέντρο',
  chartConfigurationOptionEnd: 'Τέλος',
  chartConfigurationOptionExtremities: 'Ακρότατα',
  chartConfigurationOptionTick: 'Σημείο',
  chartConfigurationOptionMonotoneX: 'Μονοτονικό Χ',
  chartConfigurationOptionMonotoneY: 'Μονοτονικό Υ',
  chartConfigurationOptionCatmullRom: 'Catmull-Rom',
  chartConfigurationOptionLinear: 'Γραμμικό',
  chartConfigurationOptionNatural: 'Φυσικό',
  chartConfigurationOptionStep: 'Βήμα',
  chartConfigurationOptionStepBefore: 'Βήμα Πριν',
  chartConfigurationOptionStepAfter: 'Βήμα Μετά',
  chartConfigurationOptionBumpX: 'Κυρτότητα Χ',
  chartConfigurationOptionBumpY: 'Κυρτότητα Υ',

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

export const elGR = getChartsLocalization(elGRLocaleText);
