/**
 * Configuration constants and package config builders.
 */
import type { PackageConfig, InterfaceDocEntry } from './types';

export const CWD = process.cwd();

// Charts: skip components by file path suffix (matches chartsSettings/index.ts)
export const CHARTS_SKIP_PATHS = [
  'x-charts/src/Gauge/GaugeReferenceArc.tsx',
  'x-charts/src/Gauge/GaugeValueArc.tsx',
  'x-charts/src/Gauge/GaugeValueText.tsx',
  'x-charts/src/BarChart/FocusedBar.tsx',
  'x-charts/src/ScatterChart/FocusedScatterMark.tsx',
  'x-charts/src/ChartsReferenceLine/ChartsXReferenceLine.tsx',
  'x-charts/src/ChartsReferenceLine/ChartsYReferenceLine.tsx',
  'x-charts/src/ChartsOverlay/ChartsOverlay.tsx',
  'x-charts/src/ChartsOverlay/ChartsNoDataOverlay.tsx',
  'x-charts/src/ChartsOverlay/ChartsLoadingOverlay.tsx',
  'x-charts/src/LineChart/CircleMarkElement.tsx',
  'x-charts/src/ScatterChart/ScatterMarker.tsx',
  'x-charts/src/BarChart/AnimatedBarElement.tsx',
  'x-charts/src/BarChart/BatchBarPlot/BarGroup.tsx',
  'x-charts/src/BarChart/BatchBarPlot/BatchBarPlot.tsx',
  'x-charts/src/RadarChart/RadarDataProvider/RadarDataProvider.tsx',
  'x-charts/src/LineChart/FocusedLineMark.tsx',
  'x-charts/src/PieChart/FocusedPieArc.tsx',
  'x-charts/src/ScatterChart/BatchScatter.tsx',
  'x-charts/src/BarChart/BatchBarPlot.tsx',
  'x-charts/src/BarChart/IndividualBarPlot.tsx',
  'x-charts-pro/src/Heatmap/HeatmapSVGPlot.tsx',
  'x-charts-pro/src/SankeyChart/SankeyLinkPlot.tsx',
  'x-charts-pro/src/SankeyChart/SankeyNodePlot.tsx',
  'x-charts-pro/src/SankeyChart/SankeyLinkLabelPlot.tsx',
  'x-charts-pro/src/SankeyChart/SankeyNodeLabelPlot.tsx',
  'x-charts-premium/src/BarChartPremium/RangeBar/AnimatedRangeBarElement.tsx',
  'x-charts-premium/src/ChartsRenderer/ChartsRenderer.tsx',
  'x-charts-premium/src/ChartsRenderer/components/PaletteOption.tsx',
  'x-charts-premium/src/HeatmapPremium/HeatmapPlotPremium.tsx',
  'x-charts-premium/src/HeatmapPremium/webgl/HeatmapWebGLPlot.tsx',
  'x-charts-premium/src/HeatmapPremium/webgl/HeatmapWebGLRenderer.tsx',
  'x-charts-premium/src/ChartsWebGLLayer/ChartsWebGLLayer.tsx',
  'x-charts/src/ChartsLayerContainer/ChartsLayerContainer.tsx',
  'x-charts/src/ChartsSvgLayer/ChartsSvgLayer.tsx',
  'x-charts/src/ChartContainer/ChartContainer.tsx',
  'x-charts-pro/src/ChartContainerPro/ChartContainerPro.tsx',
  'x-charts-premium/src/ChartContainerPremium/ChartContainerPremium.tsx',
  'x-charts/src/ChartProvider/ChartProvider.tsx',
  'x-charts/src/ChartsProvider/ChartsProvider.tsx',
  'x-charts/src/ChartDataProvider/ChartDataProvider.tsx',
  'x-charts-pro/src/ChartDataProviderPro/ChartDataProviderPro.tsx',
  'x-charts-premium/src/ChartDataProviderPremium/ChartDataProviderPremium.tsx',
  'x-charts-premium/src/CandlestickChart/seriesConfig/OHLCTooltipContent.tsx',
];

export const GRID_WHITELIST: Record<string, string[]> = {
  'x-data-grid': [
    'src/DataGrid/DataGrid.tsx',
    'src/components/panel/filterPanel/GridFilterForm.tsx',
    'src/components/panel/filterPanel/GridFilterPanel.tsx',
    'src/components/toolbar/GridToolbarQuickFilter.tsx',
    'src/components/toolbarV8/Toolbar.tsx',
    'src/components/toolbarV8/ToolbarButton.tsx',
    'src/components/export/ExportPrint.tsx',
    'src/components/export/ExportCsv.tsx',
    'src/components/quickFilter/QuickFilter.tsx',
    'src/components/quickFilter/QuickFilterControl.tsx',
    'src/components/quickFilter/QuickFilterClear.tsx',
    'src/components/quickFilter/QuickFilterTrigger.tsx',
    'src/components/filterPanel/FilterPanelTrigger.tsx',
    'src/components/columnsPanel/ColumnsPanelTrigger.tsx',
  ],
  'x-data-grid-pro': ['src/DataGridPro/DataGridPro.tsx'],
  'x-data-grid-premium': [
    'src/DataGridPremium/DataGridPremium.tsx',
    'src/components/export/ExportExcel.tsx',
    'src/components/pivotPanel/PivotPanelTrigger.tsx',
    'src/components/chartsPanel/GridChartsPanel.tsx',
    'src/components/chartsPanel/ChartsPanelTrigger.tsx',
    'src/components/aiAssistantPanel/AiAssistantPanelTrigger.tsx',
    'src/components/promptField/PromptField.tsx',
    'src/components/promptField/PromptFieldRecord.tsx',
    'src/components/promptField/PromptFieldControl.tsx',
    'src/components/promptField/PromptFieldSend.tsx',
    'src/context/GridChartsRendererProxy.tsx',
  ],
};

// Packages config
export function getPackageConfigs(): PackageConfig[] {
  const configs: PackageConfig[] = [];

  // Data Grid
  for (const [pkg, files] of Object.entries(GRID_WHITELIST)) {
    configs.push({
      name: pkg,
      packageDir: `packages/${pkg}`,
      section: 'data-grid',
      discovery: 'whitelist',
      whitelist: files,
      reExportPackages: getReExportPackages(pkg),
    });
  }

  // Date Pickers
  for (const pkg of ['x-date-pickers', 'x-date-pickers-pro']) {
    configs.push({
      name: pkg,
      packageDir: `packages/${pkg}`,
      section: 'date-pickers',
      discovery: 'scan',
      includeUnstable: true,
      reExportPackages: getReExportPackages(pkg),
    });
  }

  // Charts
  for (const pkg of ['x-charts', 'x-charts-pro', 'x-charts-premium']) {
    configs.push({
      name: pkg,
      packageDir: `packages/${pkg}`,
      section: 'charts',
      discovery: 'scan',
      includeUnstable: true,
      skipComponent: (filename: string) => {
        if (filename.includes('/context/')) {
          return true;
        }
        return CHARTS_SKIP_PATHS.some((skipPath) => filename.endsWith(skipPath));
      },
      reExportPackages: getReExportPackages(pkg),
    });
  }

  // Tree View
  for (const pkg of ['x-tree-view', 'x-tree-view-pro']) {
    configs.push({
      name: pkg,
      packageDir: `packages/${pkg}`,
      section: 'tree-view',
      discovery: 'scan',
      includeUnstable: true,
      skipComponent: (filename: string) => filename.includes('/components/'),
      reExportPackages: getReExportPackages(pkg),
    });
  }

  return configs;
}

export function getReExportPackages(pkg: string): string[] {
  switch (pkg) {
    case 'x-data-grid':
      return ['@mui/x-data-grid', '@mui/x-data-grid-pro', '@mui/x-data-grid-premium'];
    case 'x-data-grid-pro':
      return ['@mui/x-data-grid-pro', '@mui/x-data-grid-premium'];
    case 'x-data-grid-premium':
      return ['@mui/x-data-grid-premium'];
    case 'x-date-pickers':
      return ['@mui/x-date-pickers', '@mui/x-date-pickers-pro'];
    case 'x-date-pickers-pro':
      return ['@mui/x-date-pickers-pro'];
    case 'x-charts':
      return ['@mui/x-charts', '@mui/x-charts-pro', '@mui/x-charts-premium'];
    case 'x-charts-pro':
      return ['@mui/x-charts-pro', '@mui/x-charts-premium'];
    case 'x-charts-premium':
      return ['@mui/x-charts-premium'];
    case 'x-tree-view':
      return ['@mui/x-tree-view', '@mui/x-tree-view-pro'];
    case 'x-tree-view-pro':
      return ['@mui/x-tree-view-pro'];
    default:
      return [`@mui/${pkg}`];
  }
}

export const INTERFACES_TO_DOCUMENT: InterfaceDocEntry[] = [
  {
    folder: 'data-grid',
    packages: ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium', 'x-data-grid-generator'],
    documentedInterfaces: [
      'GridApi',
      'GridCellParams',
      'GridRenderContext',
      'GridRowParams',
      'GridRowClassNameParams',
      'GridRowSpacingParams',
      'GridExportStateParams',
      'GridRowOrderChangeParams',
      'GridColDef',
      'GridSingleSelectColDef',
      'GridActionsColDef',
      'GridListViewColDef',
      'GridCsvExportOptions',
      'GridPrintExportOptions',
      'GridExcelExportOptions',
      'GridFilterModel',
      'GridFilterItem',
      'GridFilterOperator',
      'GridAggregationFunction',
      'GridAggregationFunctionDataSource',
    ],
  },
  {
    folder: 'charts',
    packages: ['x-charts', 'x-charts-pro', 'x-charts-premium'],
    documentedInterfaces: [
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
];

export const DATAGRID_API_INTERFACES = [
  'GridCellSelectionApi',
  'GridColumnPinningApi',
  'GridColumnResizeApi',
  'GridCsvExportApi',
  'GridDetailPanelApi',
  'GridEditingApi',
  'GridExcelExportApi',
  'GridFilterApi',
  'GridPaginationApi',
  'GridPrintExportApi',
  'GridRowGroupingApi',
  'GridRowMultiSelectionApi',
  'GridRowSelectionApi',
  'GridScrollApi',
  'GridSortApi',
  'GridVirtualizationApi',
];

export const UNRESOLVED_OBJECT_PROPS = new Set([
  'classes',
  'slots',
  'slotProps',
  'columns',
  'currentColumn',
  'colDef',
  'initialState',
  'renderedColumns',
  'scrollBarState',
  'renderState',
  'visibleColumns',
  'cellFocus',
  'cellTabIndex',
  'csvOptions',
  'printOptions',
  'column',
  'groupingColDef',
  'rowNode',
  'pinnedColumns',
  'localeText',
  'columnGroupingModel',
  'fieldRef',
  'startFieldRef',
  'endFieldRef',
  'series',
  'axis',
  'plugins',
  'seriesConfig',
  'manager',
  // Date picker date objects
  'value',
  'defaultValue',
  'minDate',
  'maxDate',
  'minDateTime',
  'maxDateTime',
  'minTime',
  'maxTime',
  'referenceDate',
  'day',
  'currentMonth',
  'month',
]);

export const COMMON_INHERITED_PROPS = new Set(['apiRef', 'children', 'className', 'sx', 'theme', 'ref']);
