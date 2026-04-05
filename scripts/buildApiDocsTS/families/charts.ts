import type { ProductFamily } from '../config';

const SKIP: Record<string, Set<string>> = {
  'x-charts': new Set([
    'GaugeReferenceArc',
    'GaugeValueArc',
    'GaugeValueText',
    'FocusedBar',
    'FocusedScatterMark',
    'ChartsXReferenceLine',
    'ChartsYReferenceLine',
    'ChartsOverlay',
    'ChartsNoDataOverlay',
    'ChartsLoadingOverlay',
    'CircleMarkElement',
    'ScatterMarker',
    'AnimatedBarElement',
    'BarGroup',
    'BatchBarPlot',
    'RadarDataProvider',
    'FocusedLineMark',
    'FocusedPieArc',
    'BatchScatter',
    'IndividualBarPlot',
    'ChartsLayerContainer',
    'ChartsSvgLayer',
    'ChartContainer',
    'ChartProvider',
    'ChartsProvider',
    'ChartDataProvider',
  ]),
  'x-charts-pro': new Set([
    'HeatmapSVGPlot',
    'SankeyLinkPlot',
    'SankeyNodePlot',
    'SankeyLinkLabelPlot',
    'SankeyNodeLabelPlot',
    'ChartContainerPro',
    'ChartDataProviderPro',
  ]),
  'x-charts-premium': new Set([
    'AnimatedRangeBarElement',
    'ChartsRenderer',
    'PaletteOption',
    'HeatmapPlotPremium',
    'HeatmapWebGLPlot',
    'HeatmapWebGLRenderer',
    'ChartsWebGLLayer',
    'ChartContainerPremium',
    'ChartDataProviderPremium',
    'OHLCTooltipContent',
  ]),
};

export const chartsFamily: ProductFamily = {
  section: 'charts',
  packages: ['x-charts', 'x-charts-pro', 'x-charts-premium'],
  includeUnstable: true,
  skipComponent: (name, filePath) => {
    if (filePath.includes('/context/')) {
      return true;
    }
    let pkg = 'x-charts';
    if (filePath.includes('/x-charts-premium/')) {
      pkg = 'x-charts-premium';
    } else if (filePath.includes('/x-charts-pro/')) {
      pkg = 'x-charts-pro';
    }
    return SKIP[pkg]?.has(name) ?? false;
  },
  unresolvedProps: ['series', 'axis', 'plugins', 'seriesConfig', 'manager'],
  interfaces: {
    pages: [
      'BarSeries',
      'LineSeries',
      'PieSeries',
      'ScatterSeries',
      'FunnelSeries',
      'HeatmapSeries',
      'RadarSeries',
      'AxisConfig',
      'ChartImageExportOptions',
      'ChartPrintExportOptions',
      'LegendItemParams',
    ],
  },
};
