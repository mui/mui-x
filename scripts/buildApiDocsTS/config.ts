/**
 * All configuration for the API docs generation pipeline lives here.
 * Product families are the single source of truth for package relationships,
 * component discovery, interface documentation, and prop resolution rules.
 */
import type { PackageConfig } from './types';

export const CWD = process.cwd();

// ---------------------------------------------------------------------------
// Product family definition
// ---------------------------------------------------------------------------

interface ProductFamily {
  section: string;
  /** Packages ordered from base to most complete (community -> pro -> premium) */
  packages: string[];
  includeUnstable?: boolean;
  /**
   * Return true to skip a component. Receives the component name (no extension)
   * and the full file path. Called per-package — use the `pkg` closure to
   * differentiate behaviour between packages in the same family.
   * @param {string} componentName the component name (filename without .tsx)
   * @param {string} filePath the absolute path of the file being analyzed
   * @returns {boolean} true to skip this component
   */
  skipComponent?: (componentName: string, filePath: string) => boolean;
  /** Props whose types should not be expanded (kept as "object" or "arrayOf object") */
  unresolvedProps?: string[];
  /** Interfaces to generate dedicated documentation pages for */
  documentedInterfaces?: {
    extraPackages?: string[];
    names: string[];
  };
  /** Data grid API interfaces embedded in demo pages (data-grid only) */
  apiInterfaces?: string[];
}

// ---------------------------------------------------------------------------
// Skip-set helpers
// ---------------------------------------------------------------------------

const DATA_GRID_COMPONENTS: Record<string, Set<string>> = {
  'x-data-grid': new Set([
    'DataGrid',
    'GridFilterForm',
    'GridFilterPanel',
    'GridToolbarQuickFilter',
    'Toolbar',
    'ToolbarButton',
    'ExportPrint',
    'ExportCsv',
    'QuickFilter',
    'QuickFilterControl',
    'QuickFilterClear',
    'QuickFilterTrigger',
    'FilterPanelTrigger',
    'ColumnsPanelTrigger',
  ]),
  'x-data-grid-pro': new Set(['DataGridPro']),
  'x-data-grid-premium': new Set([
    'DataGridPremium',
    'ExportExcel',
    'PivotPanelTrigger',
    'GridChartsPanel',
    'ChartsPanelTrigger',
    'AiAssistantPanelTrigger',
    'PromptField',
    'PromptFieldRecord',
    'PromptFieldControl',
    'PromptFieldSend',
    'GridChartsRendererProxy',
  ]),
};

const CHARTS_SKIP: Record<string, Set<string>> = {
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
    // cspell:disable-next-line
    'OHLCTooltipContent',
  ]),
};

// ---------------------------------------------------------------------------
// Product families
// ---------------------------------------------------------------------------

const PRODUCT_FAMILIES: ProductFamily[] = [
  {
    section: 'data-grid',
    packages: ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium'],
    // Data grid uses a whitelist: skip everything not in the allowed set for each package
    skipComponent: (name, filePath) => {
      let pkg = 'x-data-grid';
      if (filePath.includes('/x-data-grid-premium/')) {
        pkg = 'x-data-grid-premium';
      } else if (filePath.includes('/x-data-grid-pro/')) {
        pkg = 'x-data-grid-pro';
      }
      return !DATA_GRID_COMPONENTS[pkg]?.has(name);
    },
    unresolvedProps: [
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
    ],
    documentedInterfaces: {
      extraPackages: ['x-data-grid-generator'],
      names: [
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
    apiInterfaces: [
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
    ],
  },
  {
    section: 'date-pickers',
    packages: ['x-date-pickers', 'x-date-pickers-pro'],
    includeUnstable: true,
    unresolvedProps: [
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
      'fieldRef',
      'startFieldRef',
      'endFieldRef',
    ],
  },
  {
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
      return CHARTS_SKIP[pkg]?.has(name) ?? false;
    },
    unresolvedProps: ['series', 'axis', 'plugins', 'seriesConfig', 'manager'],
    documentedInterfaces: {
      names: [
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
  },
  {
    section: 'tree-view',
    packages: ['x-tree-view', 'x-tree-view-pro'],
    includeUnstable: true,
    skipComponent: (_name, filePath) => filePath.includes('/components/'),
  },
];

// ---------------------------------------------------------------------------
// Derived / computed exports
// ---------------------------------------------------------------------------

/** Props that should never be type-resolved regardless of family */
const GLOBAL_UNRESOLVED_PROPS = ['classes', 'slots', 'slotProps'];

/** Build the combined set of unresolved prop names from all families */
export const UNRESOLVED_OBJECT_PROPS = new Set([
  ...GLOBAL_UNRESOLVED_PROPS,
  ...PRODUCT_FAMILIES.flatMap((f) => f.unresolvedProps ?? []),
]);

/** Props inherited from base types — only documented when declared on the component itself */
export const COMMON_INHERITED_PROPS = new Set([
  'apiRef',
  'children',
  'className',
  'sx',
  'theme',
  'ref',
]);

function getReExportPackages(pkg: string, family: ProductFamily): string[] {
  const idx = family.packages.indexOf(pkg);
  return family.packages.slice(idx).map((p) => `@mui/${p}`);
}

/** Build the flat list of PackageConfig from the product families. */
export function getPackageConfigs(): PackageConfig[] {
  const configs: PackageConfig[] = [];
  for (const family of PRODUCT_FAMILIES) {
    for (const pkg of family.packages) {
      configs.push({
        name: pkg,
        packageDir: `packages/${pkg}`,
        section: family.section,
        includeUnstable: family.includeUnstable,
        skipComponent: family.skipComponent,
        reExportPackages: getReExportPackages(pkg, family),
      });
    }
  }
  return configs;
}

/** Interface documentation entries derived from families that define them. */
export function getInterfacesToDocument(): {
  folder: string;
  packages: string[];
  documentedInterfaces: string[];
}[] {
  return PRODUCT_FAMILIES.filter((f) => f.documentedInterfaces).map((f) => ({
    folder: f.section,
    packages: [...f.packages, ...(f.documentedInterfaces!.extraPackages ?? [])],
    documentedInterfaces: f.documentedInterfaces!.names,
  }));
}

/** Data grid API interfaces (embedded in demo pages). */
export function getDatagridApiInterfaces(): string[] {
  const dgFamily = PRODUCT_FAMILIES.find((f) => f.section === 'data-grid');
  return dgFamily?.apiInterfaces ?? [];
}
