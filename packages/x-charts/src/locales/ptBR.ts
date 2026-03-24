import { imageMimeTypes } from './utils/imageMimeTypes';
import { type ChartsLocaleText } from './utils/chartsLocaleTextApi';
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
  chartTypeBar: 'Barra',
  chartTypeColumn: 'Coluna',
  chartTypeLine: 'Linha',
  chartTypeArea: 'Área',
  chartTypePie: 'Pizza',
  chartPaletteLabel: 'Paleta de cores',
  chartPaletteNameRainbowSurge: 'Onda de Arco-íris',
  chartPaletteNameBlueberryTwilight: 'Crepúsculo de Blueberry',
  chartPaletteNameMangoFusion: 'Fusão de Manga',
  chartPaletteNameCheerfulFiesta: 'Festa Alegre',
  chartPaletteNameStrawberrySky: 'Céu de Morango',
  chartPaletteNameBlue: 'Azul',
  chartPaletteNameGreen: 'Verde',
  chartPaletteNamePurple: 'Roxo',
  chartPaletteNameRed: 'Vermelho',
  chartPaletteNameOrange: 'Laranja',
  chartPaletteNameYellow: 'Amarelo',
  chartPaletteNameCyan: 'Ciano',
  chartPaletteNamePink: 'Rosa',
  chartConfigurationSectionChart: 'Gráfico',
  chartConfigurationSectionColumns: 'Colunas',
  chartConfigurationSectionBars: 'Barras',
  chartConfigurationSectionAxes: 'Eixos',
  chartConfigurationGrid: 'Grade',
  chartConfigurationBorderRadius: 'Arredondamento da borda',
  chartConfigurationCategoryGapRatio: 'Proporção de espaço entre categorias',
  chartConfigurationBarGapRatio: 'Proporção de espaço entre séries',
  chartConfigurationStacked: 'Empilhado',
  chartConfigurationShowToolbar: 'Mostrar barra de ferramentas',
  chartConfigurationSkipAnimation: 'Ignorar animação',
  chartConfigurationInnerRadius: 'Raio interno',
  chartConfigurationOuterRadius: 'Raio externo',
  chartConfigurationColors: 'Cores',
  chartConfigurationHideLegend: 'Ocultar legenda',
  chartConfigurationShowMark: 'Mostrar marcação',
  chartConfigurationHeight: 'Altura',
  chartConfigurationWidth: 'Largura',
  chartConfigurationSeriesGap: 'Espaçamento entre séries',
  chartConfigurationTickPlacement: 'Posição da marcação',
  chartConfigurationTickLabelPlacement: 'Posição do título da marcação',
  chartConfigurationCategoriesAxisLabel: 'Título do eixo de categorias',
  chartConfigurationSeriesAxisLabel: 'Título do eixo de séries',
  chartConfigurationXAxisPosition: 'Posição do eixo X',
  chartConfigurationYAxisPosition: 'Posição do eixo Y',
  chartConfigurationSeriesAxisReverse: 'Inverter eixo de séries',
  chartConfigurationTooltipPlacement: 'Posição',
  chartConfigurationTooltipTrigger: 'Gatilho',
  chartConfigurationLegendPosition: 'Posição',
  chartConfigurationLegendDirection: 'Direção',
  chartConfigurationBarLabels: 'Títulos das barras',
  chartConfigurationColumnLabels: 'Títulos das colunas',
  chartConfigurationInterpolation: 'Interpolação',
  chartConfigurationSectionTooltip: 'Tooltip',
  chartConfigurationSectionLegend: 'Legenda',
  chartConfigurationSectionLines: 'Linhas',
  chartConfigurationSectionAreas: 'Áreas',
  chartConfigurationSectionArcs: 'Arcos',
  chartConfigurationPaddingAngle: 'Ângulo de preenchimento',
  chartConfigurationCornerRadius: 'Raio do canto',
  chartConfigurationArcLabels: 'Títulos dos arcos',
  chartConfigurationStartAngle: 'Ângulo inicial',
  chartConfigurationEndAngle: 'Ângulo final',
  chartConfigurationPieTooltipTrigger: 'Gatilho',
  chartConfigurationPieLegendPosition: 'Posição',
  chartConfigurationPieLegendDirection: 'Direção',

  // Common option labels
  chartConfigurationOptionNone: 'Nenhum',
  chartConfigurationOptionValue: 'Valor',
  chartConfigurationOptionAuto: 'Automático',
  chartConfigurationOptionTop: 'Topo',
  chartConfigurationOptionTopLeft: 'Topo Esquerdo',
  chartConfigurationOptionTopRight: 'Topo Direito',
  chartConfigurationOptionBottom: 'Inferior',
  chartConfigurationOptionBottomLeft: 'Inferior Esquerdo',
  chartConfigurationOptionBottomRight: 'Inferior Direito',
  chartConfigurationOptionLeft: 'Esquerda',
  chartConfigurationOptionRight: 'Direita',
  chartConfigurationOptionAxis: 'Eixo',
  chartConfigurationOptionItem: 'Item',
  chartConfigurationOptionHorizontal: 'Horizontal',
  chartConfigurationOptionVertical: 'Vertical',
  chartConfigurationOptionBoth: 'Ambos',
  chartConfigurationOptionStart: 'Início',
  chartConfigurationOptionMiddle: 'Meio',
  chartConfigurationOptionEnd: 'Fim',
  chartConfigurationOptionExtremities: 'Extremidades',
  chartConfigurationOptionTick: 'Marcação',
  chartConfigurationOptionMonotoneX: 'Monótono X',
  chartConfigurationOptionMonotoneY: 'Monótono Y',
  chartConfigurationOptionCatmullRom: 'Catmull-Rom',
  chartConfigurationOptionLinear: 'Linear',
  chartConfigurationOptionNatural: 'Natural',
  chartConfigurationOptionStep: 'Passo',
  chartConfigurationOptionStepBefore: 'Passo Anterior',
  chartConfigurationOptionStepAfter: 'Passo Posterior',
  chartConfigurationOptionBumpX: 'Colisão X',
  chartConfigurationOptionBumpY: 'Colisão Y',

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

export const ptBR = getChartsLocalization(ptBRLocaleText);
