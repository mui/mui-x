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
  /** The docs section name (data-grid, date-pickers, charts, tree-view) */
  section: string;
  /** Packages ordered from base to most complete (community -> pro -> premium) */
  packages: string[];
  /** How to discover components */
  discovery: 'whitelist' | 'scan';
  includeUnstable?: boolean;
  /**
   * Skip component predicate (for 'scan' mode)
   * @param {string} filename the absolute path of the file being analyzed
   * @returns {boolean} true to skip this file/component, false to include it
   */
  skipComponent?: (filename: string) => boolean;
  /** Component names to skip, per package. Matched against the filename without extension. */
  skipComponents?: Record<string, string[]>;
  /** Component names to include, per package. Only these will be documented (whitelist mode). */
  components?: Record<string, string[]>;
  /** Props whose types should not be expanded (kept as "object" or "arrayOf object") */
  unresolvedProps?: string[];
  /** Interfaces to generate dedicated documentation pages for */
  documentedInterfaces?: {
    /** Extra packages to search for the interfaces (e.g. x-data-grid-generator) */
    extraPackages?: string[];
    names: string[];
  };
  /** Data grid API interfaces embedded in demo pages (data-grid only) */
  apiInterfaces?: string[];
}

// ---------------------------------------------------------------------------
// Product families
// ---------------------------------------------------------------------------

const PRODUCT_FAMILIES: ProductFamily[] = [
  {
    section: 'data-grid',
    packages: ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium'],
    discovery: 'whitelist',
    components: {
      'x-data-grid': [
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
      ],
      'x-data-grid-pro': ['DataGridPro'],
      'x-data-grid-premium': [
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
      ],
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
    discovery: 'scan',
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
    discovery: 'scan',
    includeUnstable: true,
    skipComponent: (filename: string) => filename.includes('/context/'),
    skipComponents: {
      'x-charts': [
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
      ],
      'x-charts-pro': [
        'HeatmapSVGPlot',
        'SankeyLinkPlot',
        'SankeyNodePlot',
        'SankeyLinkLabelPlot',
        'SankeyNodeLabelPlot',
        'ChartContainerPro',
        'ChartDataProviderPro',
      ],
      'x-charts-premium': [
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
      ],
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
    discovery: 'scan',
    includeUnstable: true,
    skipComponent: (filename: string) => filename.includes('/components/'),
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

/**
 * Compute re-export packages: this package + all tiers above it.
 */
function getReExportPackages(pkg: string, family: ProductFamily): string[] {
  const idx = family.packages.indexOf(pkg);
  return family.packages.slice(idx).map((p) => `@mui/${p}`);
}

/** Build the flat list of PackageConfig from the product families. */
export function getPackageConfigs(): PackageConfig[] {
  const configs: PackageConfig[] = [];
  for (const family of PRODUCT_FAMILIES) {
    for (const pkg of family.packages) {
      // Build the skip predicate by combining skipComponent + skipComponents for this package
      const skipNames = new Set(family.skipComponents?.[pkg]);
      const skipFn = family.skipComponent;
      let skipComponent: ((filename: string) => boolean) | undefined;
      if (skipFn || skipNames.size > 0) {
        skipComponent = (filename: string) => {
          if (skipFn?.(filename)) {
            return true;
          }
          const name = filename.replace(/.*\//, '').replace(/\.tsx$/, '');
          return skipNames.has(name);
        };
      }

      configs.push({
        name: pkg,
        packageDir: `packages/${pkg}`,
        section: family.section,
        discovery: family.discovery,
        includeUnstable: family.includeUnstable,
        skipComponent,
        componentNames: family.components?.[pkg],
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
