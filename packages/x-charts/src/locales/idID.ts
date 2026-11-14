import { imageMimeTypes } from './utils/imageMimeTypes';
import type { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const idIDLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Memuat data…',
  noData: 'Tidak ada data untuk ditampilkan',

  // Toolbar
  zoomIn: 'Perbesar',
  zoomOut: 'Perkecil',
  toolbarExport: 'Ekspor',

  // Toolbar Export Menu
  toolbarExportPrint: 'Cetak',
  toolbarExportImage: (mimeType) => `Ekspor sebagai ${imageMimeTypes[mimeType] ?? mimeType}`,
  toolbarExportExcel: 'Ekspor sebagai Excel',

  // Charts renderer configuration
  chartTypeBar: 'Batang',
  chartTypeColumn: 'Kolom',
  chartTypeLine: 'Garis',
  chartTypeArea: 'Area',
  chartTypePie: 'Pai',
  chartPaletteLabel: 'Palet warna',
  chartPaletteNameRainbowSurge: 'Gelombang Pelangi',
  chartPaletteNameBlueberryTwilight: 'Senja Bluberi',
  chartPaletteNameMangoFusion: 'Perpaduan Mangga',
  chartPaletteNameCheerfulFiesta: 'Pesta Ceria',
  chartPaletteNameStrawberrySky: 'Langit Stroberi',
  chartPaletteNameBlue: 'Biru',
  chartPaletteNameGreen: 'Hijau',
  chartPaletteNamePurple: 'Ungu',
  chartPaletteNameRed: 'Merah',
  chartPaletteNameOrange: 'Oranye',
  chartPaletteNameYellow: 'Kuning',
  chartPaletteNameCyan: 'Sian',
  chartPaletteNamePink: 'Merah muda',
  chartConfigurationSectionChart: 'Diagram',
  chartConfigurationSectionColumns: 'Kolom',
  chartConfigurationSectionBars: 'Batang',
  chartConfigurationSectionAxes: 'Sumbu',
  chartConfigurationGrid: 'Kisi',
  chartConfigurationBorderRadius: 'Radius tepi',
  chartConfigurationCategoryGapRatio: 'Rasio jarak kategori',
  chartConfigurationBarGapRatio: 'Rasio jarak seri',
  chartConfigurationStacked: 'Bertumpuk',
  chartConfigurationShowToolbar: 'Tampilkan bilah alat',
  chartConfigurationSkipAnimation: 'Lewati animasi',
  chartConfigurationInnerRadius: 'Radius dalam',
  chartConfigurationOuterRadius: 'Radius luar',
  chartConfigurationColors: 'Warna',
  chartConfigurationHideLegend: 'Sembunyikan legenda',
  chartConfigurationShowMark: 'Tampilkan penanda',
  chartConfigurationHeight: 'Tinggi',
  chartConfigurationWidth: 'Lebar',
  chartConfigurationSeriesGap: 'Jarak seri',
  chartConfigurationTickPlacement: 'Penempatan tanda skala',
  chartConfigurationTickLabelPlacement: 'Penempatan label tanda skala',
  chartConfigurationCategoriesAxisLabel: 'Label sumbu kategori',
  chartConfigurationSeriesAxisLabel: 'Label sumbu seri',
  chartConfigurationXAxisPosition: 'Posisi sumbu X',
  chartConfigurationYAxisPosition: 'Posisi sumbu Y',
  chartConfigurationSeriesAxisReverse: 'Balik sumbu seri',
  chartConfigurationTooltipPlacement: 'Penempatan',
  chartConfigurationTooltipTrigger: 'Pemicu',
  chartConfigurationLegendPosition: 'Posisi',
  chartConfigurationLegendDirection: 'Arah',
  chartConfigurationBarLabels: 'Label batang',
  chartConfigurationColumnLabels: 'Label kolom',
  chartConfigurationInterpolation: 'Interpolasi',
  chartConfigurationSectionTooltip: 'Tooltip',
  chartConfigurationSectionLegend: 'Legenda',
  chartConfigurationSectionLines: 'Garis',
  chartConfigurationSectionAreas: 'Area',
  chartConfigurationSectionArcs: 'Busur',
  chartConfigurationPaddingAngle: 'Sudut jarak',
  chartConfigurationCornerRadius: 'Radius sudut',
  chartConfigurationArcLabels: 'Label busur',
  chartConfigurationStartAngle: 'Sudut awal',
  chartConfigurationEndAngle: 'Sudut akhir',
  chartConfigurationPieTooltipTrigger: 'Pemicu',
  chartConfigurationPieLegendPosition: 'Posisi',
  chartConfigurationPieLegendDirection: 'Arah',

  // Common option labels
  chartConfigurationOptionNone: 'Tidak ada',
  chartConfigurationOptionValue: 'Nilai',
  chartConfigurationOptionAuto: 'Otomatis',
  chartConfigurationOptionTop: 'Atas',
  chartConfigurationOptionTopLeft: 'Kiri atas',
  chartConfigurationOptionTopRight: 'Kanan atas',
  chartConfigurationOptionBottom: 'Bawah',
  chartConfigurationOptionBottomLeft: 'Kiri bawah',
  chartConfigurationOptionBottomRight: 'Kanan bawah',
  chartConfigurationOptionLeft: 'Kiri',
  chartConfigurationOptionRight: 'Kanan',
  chartConfigurationOptionAxis: 'Sumbu',
  chartConfigurationOptionItem: 'Item',
  chartConfigurationOptionHorizontal: 'Horizontal',
  chartConfigurationOptionVertical: 'Vertikal',
  chartConfigurationOptionBoth: 'Keduanya',
  chartConfigurationOptionStart: 'Awal',
  chartConfigurationOptionMiddle: 'Tengah',
  chartConfigurationOptionEnd: 'Akhir',
  chartConfigurationOptionExtremities: 'Ujung',
  chartConfigurationOptionTick: 'Tanda skala',
  chartConfigurationOptionMonotoneX: 'Monotone X',
  chartConfigurationOptionMonotoneY: 'Monotone Y',
  chartConfigurationOptionCatmullRom: 'Catmull-Rom',
  chartConfigurationOptionLinear: 'Linear',
  chartConfigurationOptionNatural: 'Natural',
  chartConfigurationOptionStep: 'Bertingkat',
  chartConfigurationOptionStepBefore: 'Bertingkat sebelum',
  chartConfigurationOptionStepAfter: 'Bertingkat sesudah',
  chartConfigurationOptionBumpX: 'Bump X',
  chartConfigurationOptionBumpY: 'Bump Y',

  // OHLC/Candlestick
  open: 'Pembukaan',
  high: 'Tertinggi',
  low: 'Terendah',
  close: 'Penutupan',

  // Accessibility descriptions
  a11yNoValue: 'tidak ada nilai',
  a11yConnector: '; ',
  zoomRangeDescription: function zoomRangeDescription({ axisDirection, start, end }) {
    const axisName = axisDirection === 'x' ? 'sumbu horizontal' : 'sumbu vertikal';
    return `Menampilkan ${Math.round(start)}% hingga ${Math.round(end)}% dari ${axisName}`;
  },
  zoomSliderStartLabel: function zoomSliderStartLabel({ axisDirection, axisLabel }) {
    const axisName = axisLabel ?? (axisDirection === 'x' ? 'Sumbu horizontal' : 'Sumbu vertikal');
    return `Awal zoom ${axisName}`;
  },
  zoomSliderEndLabel: function zoomSliderEndLabel({ axisDirection, axisLabel }) {
    const axisName = axisLabel ?? (axisDirection === 'x' ? 'Sumbu horizontal' : 'Sumbu vertikal');
    return `Akhir zoom ${axisName}`;
  },
  barDescription: function barDescription({
    value,
    formattedValue,
    formattedCategoryValue,
    seriesLabel,
  }) {
    return [formattedCategoryValue, seriesLabel, value === null ? this.a11yNoValue : formattedValue]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
  lineDescription: function lineDescription({ y, formattedXValue, formattedYValue, seriesLabel }) {
    return [formattedXValue, seriesLabel, y === null ? this.a11yNoValue : formattedYValue]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
  scatterDescription: function scatterDescription({
    formattedXValue,
    formattedYValue,
    seriesLabel,
  }) {
    return [seriesLabel, formattedXValue, formattedYValue].filter(Boolean).join(this.a11yConnector);
  },
  pieDescription: function pieDescription({ value, formattedValue, seriesLabel }) {
    return [seriesLabel, value === null ? this.a11yNoValue : formattedValue]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
  radarDescription: function radarDescription({
    value,
    formattedValue,
    formattedCategoryValue,
    seriesLabel,
  }) {
    return [formattedCategoryValue, seriesLabel, value === null ? this.a11yNoValue : formattedValue]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
  funnelDescription: function funnelDescription({ value, formattedValue, seriesLabel }) {
    return [seriesLabel, value === null ? this.a11yNoValue : formattedValue]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
  heatmapDescription: function heatmapDescription({
    value,
    formattedValue,
    formattedXValue,
    formattedYValue,
  }) {
    return [formattedXValue, formattedYValue, value === null ? this.a11yNoValue : formattedValue]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
  sankeyNodeDescription: function sankeyNodeDescription({ formattedValue, nodeLabel }) {
    return [nodeLabel, formattedValue].filter(Boolean).join(this.a11yConnector);
  },
  sankeyLinkDescription: function sankeyLinkDescription({
    formattedValue,
    sourceLabel,
    targetLabel,
  }) {
    return [
      sourceLabel && targetLabel
        ? `${sourceLabel} ke ${targetLabel}`
        : (sourceLabel ?? targetLabel),
      formattedValue,
    ]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
  rangeBarDescription: function rangeBarDescription({
    value,
    formattedValue,
    formattedCategoryValue,
    seriesLabel,
  }) {
    return [formattedCategoryValue, seriesLabel, value === null ? this.a11yNoValue : formattedValue]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
  ohlcDescription: function ohlcDescription({
    open,
    high,
    low,
    close,
    formattedOpen,
    formattedHigh,
    formattedLow,
    formattedClose,
    formattedDate,
    seriesLabel,
  }) {
    const hasValues = open !== null && high !== null && low !== null && close !== null;
    return [
      formattedDate,
      seriesLabel,
      hasValues
        ? `Pembukaan: ${formattedOpen ?? open}, Tertinggi: ${formattedHigh ?? high}, Terendah: ${formattedLow ?? low}, Penutupan: ${formattedClose ?? close}`
        : this.a11yNoValue,
    ]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
};

export const idID = getChartsLocalization(idIDLocaleText);
