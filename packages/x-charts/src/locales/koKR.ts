import { imageMimeTypes } from './utils/imageMimeTypes';
import type { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const koKRLocaleText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: '데이터를 불러오는 중…',
  noData: '표시할 데이터가 없습니다',

  // Toolbar
  zoomIn: '확대',
  zoomOut: '축소',
  toolbarExport: '내보내기',

  // Toolbar Export Menu
  toolbarExportPrint: '인쇄',
  toolbarExportImage: (mimeType) => `${imageMimeTypes[mimeType] ?? mimeType} 형식으로 내보내기`,
  toolbarExportExcel: 'Excel 형식으로 내보내기',

  // Charts renderer configuration
  chartTypeBar: '가로 막대형',
  chartTypeColumn: '세로 막대형',
  chartTypeLine: '꺾은선형',
  chartTypeArea: '영역형',
  chartTypePie: '원형',
  chartPaletteLabel: '색상 팔레트',
  chartPaletteNameRainbowSurge: '무지개 물결',
  chartPaletteNameBlueberryTwilight: '블루베리 황혼',
  chartPaletteNameMangoFusion: '망고 퓨전',
  chartPaletteNameCheerfulFiesta: '즐거운 축제',
  chartPaletteNameStrawberrySky: '딸기빛 하늘',
  chartPaletteNameBlue: '파랑',
  chartPaletteNameGreen: '초록',
  chartPaletteNamePurple: '보라',
  chartPaletteNameRed: '빨강',
  chartPaletteNameOrange: '주황',
  chartPaletteNameYellow: '노랑',
  chartPaletteNameCyan: '청록',
  chartPaletteNamePink: '분홍',
  chartConfigurationSectionChart: '차트',
  chartConfigurationSectionColumns: '세로 막대',
  chartConfigurationSectionBars: '가로 막대',
  chartConfigurationSectionAxes: '축',
  chartConfigurationGrid: '눈금선',
  chartConfigurationBorderRadius: '모서리 반경',
  chartConfigurationCategoryGapRatio: '범주 간격 비율',
  chartConfigurationBarGapRatio: '계열 간격 비율',
  chartConfigurationStacked: '누적',
  chartConfigurationShowToolbar: '도구 모음 표시',
  chartConfigurationSkipAnimation: '애니메이션 건너뛰기',
  chartConfigurationInnerRadius: '안쪽 반경',
  chartConfigurationOuterRadius: '바깥쪽 반경',
  chartConfigurationColors: '색상',
  chartConfigurationHideLegend: '범례 숨기기',
  chartConfigurationShowMark: '표식 표시',
  chartConfigurationHeight: '높이',
  chartConfigurationWidth: '너비',
  chartConfigurationSeriesGap: '계열 간격',
  chartConfigurationTickPlacement: '눈금 위치',
  chartConfigurationTickLabelPlacement: '눈금 레이블 위치',
  chartConfigurationCategoriesAxisLabel: '범주 축 레이블',
  chartConfigurationSeriesAxisLabel: '계열 축 레이블',
  chartConfigurationXAxisPosition: 'X축 위치',
  chartConfigurationYAxisPosition: 'Y축 위치',
  chartConfigurationSeriesAxisReverse: '계열 축 반전',
  chartConfigurationTooltipPlacement: '위치',
  chartConfigurationTooltipTrigger: '표시 조건',
  chartConfigurationLegendPosition: '위치',
  chartConfigurationLegendDirection: '방향',
  chartConfigurationBarLabels: '가로 막대 레이블',
  chartConfigurationColumnLabels: '세로 막대 레이블',
  chartConfigurationInterpolation: '보간',
  chartConfigurationSectionTooltip: '툴팁',
  chartConfigurationSectionLegend: '범례',
  chartConfigurationSectionLines: '선',
  chartConfigurationSectionAreas: '영역',
  chartConfigurationSectionArcs: '조각',
  chartConfigurationPaddingAngle: '조각 간격 각도',
  chartConfigurationCornerRadius: '모서리 반경',
  chartConfigurationArcLabels: '조각 레이블',
  chartConfigurationStartAngle: '시작 각도',
  chartConfigurationEndAngle: '끝 각도',
  chartConfigurationPieTooltipTrigger: '표시 조건',
  chartConfigurationPieLegendPosition: '위치',
  chartConfigurationPieLegendDirection: '방향',

  // Common option labels
  chartConfigurationOptionNone: '없음',
  chartConfigurationOptionValue: '값',
  chartConfigurationOptionAuto: '자동',
  chartConfigurationOptionTop: '위쪽',
  chartConfigurationOptionTopLeft: '왼쪽 위',
  chartConfigurationOptionTopRight: '오른쪽 위',
  chartConfigurationOptionBottom: '아래쪽',
  chartConfigurationOptionBottomLeft: '왼쪽 아래',
  chartConfigurationOptionBottomRight: '오른쪽 아래',
  chartConfigurationOptionLeft: '왼쪽',
  chartConfigurationOptionRight: '오른쪽',
  chartConfigurationOptionAxis: '축',
  chartConfigurationOptionItem: '항목',
  chartConfigurationOptionHorizontal: '가로',
  chartConfigurationOptionVertical: '세로',
  chartConfigurationOptionBoth: '양쪽',
  chartConfigurationOptionStart: '시작',
  chartConfigurationOptionMiddle: '가운데',
  chartConfigurationOptionEnd: '끝',
  chartConfigurationOptionExtremities: '양 끝',
  chartConfigurationOptionTick: '눈금',
  chartConfigurationOptionMonotoneX: '단조 X',
  chartConfigurationOptionMonotoneY: '단조 Y',
  chartConfigurationOptionCatmullRom: 'Catmull-Rom',
  chartConfigurationOptionLinear: '직선',
  chartConfigurationOptionNatural: '자연 곡선',
  chartConfigurationOptionStep: '계단',
  chartConfigurationOptionStepBefore: '계단 (앞)',
  chartConfigurationOptionStepAfter: '계단 (뒤)',
  chartConfigurationOptionBumpX: 'Bump X',
  chartConfigurationOptionBumpY: 'Bump Y',

  // OHLC/Candlestick
  open: '시가',
  high: '고가',
  low: '저가',
  close: '종가',

  // Accessibility descriptions
  a11yNoValue: '값 없음',
  a11yConnector: '; ',
  zoomRangeDescription: function zoomRangeDescription({ axisDirection, start, end }) {
    const axisName = axisDirection === 'x' ? '가로축' : '세로축';
    return `${axisName}의 ${Math.round(start)}%부터 ${Math.round(end)}%까지 표시`;
  },
  zoomSliderStartLabel: function zoomSliderStartLabel({ axisDirection, axisLabel }) {
    const axisName = axisLabel ?? (axisDirection === 'x' ? '가로축' : '세로축');
    return `${axisName} 확대/축소 시작`;
  },
  zoomSliderEndLabel: function zoomSliderEndLabel({ axisDirection, axisLabel }) {
    const axisName = axisLabel ?? (axisDirection === 'x' ? '가로축' : '세로축');
    return `${axisName} 확대/축소 끝`;
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
        ? `${sourceLabel}에서 ${targetLabel}까지`
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
        ? `시가: ${formattedOpen ?? open}, 고가: ${formattedHigh ?? high}, 저가: ${formattedLow ?? low}, 종가: ${formattedClose ?? close}`
        : this.a11yNoValue,
    ]
      .filter(Boolean)
      .join(this.a11yConnector);
  },
};

export const koKR = getChartsLocalization(koKRLocaleText);
