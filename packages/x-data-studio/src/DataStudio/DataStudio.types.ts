import * as React from 'react';
import type { SxProps } from '@mui/system';
import type { Theme } from '@mui/material/styles';
import type { ChatAdapter } from '@mui/x-chat-headless';
import type { CopilotPlugin } from '@mui/x-copilot';
import type {
  DataGridProps,
  GridColDef,
  GridDataSourceCache,
  GridGetRowsError,
  GridInitialState,
  GridRowsProp,
  GridUpdateRowError,
  GridValidRowModel,
} from '@mui/x-data-grid';
import type { DataStudioClasses } from './dataStudioClasses';
import type { DataStudioDataSource } from '../createDataStudioDataSourceFromAPI';
import type { DataStudioToolbarProps } from '../DataStudioToolbar/DataStudioToolbar';
import type { DataStudioMenuBarProps } from '../DataStudioMenuBar/DataStudioMenuBar';
import type { DataStudioSessionCacheOptions } from './sessionCache';
import type { DataStudioRoutingAdapter } from './routing';
import type { DataStudioViewsPersistenceAdapter } from './viewsPersistence';
import type {
  StudioCopilotPanelProps,
  StudioGuards,
} from '../copilot';

/**
 * Strategy applied to the Data Source cache used by every dataset in a `<DataStudio>`.
 *
 * - `'shared'`: a single LRU cache (with per-dataset namespacing) is shared across all datasets.
 *   Switching datasets/views reuses cached pages and one dataset's mutation does not
 *   invalidate another dataset's entries.
 * - `'per-dataset'`: each dataset gets its own `GridDataSourceCacheDefault` (the legacy
 *   Data Grid default).
 * - `'none'`: Data Source caching is disabled (`dataSourceCache={null}` is passed).
 *
 * A `dataset.dataSourceCache` set on an individual dataset always takes precedence.
 */
export type DataStudioCacheStrategy = 'shared' | 'per-dataset' | 'none';

/**
 * MUI X licensing tier the studio targets. Drives the default `dataGrid` slot
 * (DataGrid / DataGridPro / DataGridPremium) and whether the built-in chart
 * workspace is active.
 *
 * - `'community'`: free DataGrid. Chart workspace is replaced by an
 *   "Upgrade to Premium" prompt.
 * - `'pro'`: DataGridPro. Chart workspace is the upgrade prompt.
 * - `'premium'`: DataGridPremium + the built-in chart workspace powered by the
 *   grid's `chartsIntegration` and `@mui/x-charts-premium`.
 */
export type DataStudioPlan = 'community' | 'pro' | 'premium';

export interface DataStudioAggregationFunctionDescriptor {
  columnTypes?: string[];
}

export type DataStudioDataGridProps<R extends GridValidRowModel = any> = Partial<
  Omit<
    DataGridProps<R>,
    | 'columns'
    | 'rows'
    | 'getRowId'
    | 'dataSource'
    | 'dataSourceCache'
    | 'dataSourceRevalidateMs'
    | 'onDataSourceError'
    | 'pagination'
  >
> & {
  /**
   * If `true`, pagination is enabled.
   * DataGridPro and DataGridPremium can disable pagination; the community DataGrid forces it on.
   */
  pagination?: boolean;
  /**
   * Used with a DataGridPro or DataGridPremium slot and `dataSource` to enable server-side lazy loading.
   */
  lazyLoading?: boolean;
  /**
   * Used with a DataGridPremium slot to enable spreadsheet-style cell range selection.
   * Click a cell to select it, drag to select a range, click a column header to select the column.
   */
  cellSelection?: boolean;
  /**
   * Throttle delay in milliseconds for lazy loading requests.
   */
  lazyLoadingRequestThrottleMs?: number;
  /**
   * Area in pixels at the bottom of the grid viewport where the next lazy loading request is triggered.
   */
  scrollEndThreshold?: number;
  /**
   * Server-side aggregation functions exposed to DataGridPremium when Data Studio is used with a Data Source.
   */
  aggregationFunctions?: Record<string, DataStudioAggregationFunctionDescriptor>;
  /**
   * Creates generated pivot column definitions for DataGridPremium server-side pivoting.
   * @param {GridColDef<R>['field']} originalColumnField The source column field used as a pivot value.
   * @param {string[]} columnGroupPath The server pivot column group path.
   * @returns {Partial<GridColDef<R>> & { field: string }} The generated pivot column definition.
   */
  pivotingColDef?: (
    originalColumnField: GridColDef<R>['field'],
    columnGroupPath: string[],
  ) => Partial<GridColDef<R>> & { field: string };
};

export interface DataStudioDataGridInjectedProps<R extends GridValidRowModel = any> {
  columns: GridColDef<R>[];
  rows: GridRowsProp<R>;
  rowIdField?: string;
  getRowId?: DataGridProps<R>['getRowId'];
  dataSource?: DataStudioDataSource;
  dataSourceCache?: GridDataSourceCache | null;
  dataSourceRevalidateMs?: DataGridProps<R>['dataSourceRevalidateMs'];
  onDataSourceError?: (error: GridGetRowsError | GridUpdateRowError) => void;
}

export type DataStudioDataGridComponent = React.ElementType;

export type DataStudioToolbarComponent = React.ComponentType<DataStudioToolbarProps>;
export type DataStudioMenuBarComponent = React.ComponentType<DataStudioMenuBarProps>;

/**
 * Props passed to the `chartView` slot. The slot owns the entire chart
 * workspace (config sidebar + chart preview); Data Studio provides the data
 * model and the dataset selector callback so the slot can stay focused on
 * configuration + rendering.
 */
export interface DataStudioChartViewProps<R extends GridValidRowModel = any> {
  /**
   * The dataset the chart is currently bound to. `null` while no dataset
   * matches the view's `datasetId`.
   */
  dataset: DataStudioDataset<R> | null;
  /**
   * All datasets in the studio. The slot typically renders a chooser using
   * this list.
   */
  datasets: DataStudioDataset<R>[];
  /**
   * The active chart view.
   */
  view: DataStudioView;
  /**
   * Change the dataset bound to the active chart view.
   * @param {string} datasetId The id of the new dataset.
   */
  onChangeDataset: (datasetId: string) => void;
  /**
   * The Data Source cache resolved for the active dataset by Data Studio.
   * Pass this to any embedded DataGrid in the chart workspace so that grid
   * shares the cache with the main grid (no duplicate `getRows` round-trips).
   *
   * - `undefined` — Data Studio is letting the grid build its own default cache.
   * - `null` — caching is disabled for this dataset.
   * - Otherwise — the shared `GridDataSourceCache` instance.
   */
  dataSourceCache: GridDataSourceCache | null | undefined;
}

export type DataStudioChartViewComponent = React.ComponentType<DataStudioChartViewProps>;

export interface DataStudioSlots {
  /**
   * The Data Grid component used to render datasets.
   * Use this slot to provide DataGridPro or DataGridPremium.
   * @default DataGrid
   */
  dataGrid?: DataStudioDataGridComponent;
  /**
   * The top menu bar (brand + title + menu strip) rendered above the toolbar.
   * Set to `null` to hide the menu bar.
   * @default DataStudioMenuBar
   */
  menuBar?: DataStudioMenuBarComponent | null;
  /**
   * The toolbar rendered between the menu bar and the Data Grid.
   * Set to `null` to hide the toolbar.
   * @default DataStudioToolbar
   */
  toolbar?: DataStudioToolbarComponent | null;
  /**
   * The chart workspace rendered when the active view's `kind === 'chart'`.
   * The default implementation shows a configuration placeholder; provide a
   * slot to plug in a real chart configuration + preview (typically driven by
   * the Premium charts integration).
   * @default DataStudioChartViewDefault
   */
  chartView?: DataStudioChartViewComponent;
  /**
   * The Copilot chat panel rendered inside the right-side drawer when
   * `copilotChatAdapter` is provided. Receives the wrapped adapter,
   * plugin render context, and query-result cache.
   * @default StudioCopilotPanel
   */
  copilotPanel?: React.ComponentType<StudioCopilotPanelProps>;
  /**
   * The toolbar trigger button that opens the Copilot panel. Rendered only
   * when `copilotChatAdapter` is provided. Use to customize the icon/affordance.
   */
  copilotTrigger?: React.ComponentType<{}>;
}

export interface DataStudioSlotProps<R extends GridValidRowModel = any> {
  /**
   * Props forwarded to the Data Grid slot.
   */
  dataGrid?: DataStudioDataGridProps<R>;
  /**
   * Props forwarded to the menu bar slot.
   */
  menuBar?: Partial<Omit<DataStudioMenuBarProps, 'apiRef'>>;
  /**
   * Props forwarded to the toolbar slot.
   */
  toolbar?: Partial<Omit<DataStudioToolbarProps, 'apiRef'>>;
  /**
   * Props forwarded to the chartView slot.
   */
  chartView?: Partial<
    Omit<DataStudioChartViewProps<R>, 'dataset' | 'datasets' | 'view' | 'onChangeDataset'>
  >;
}

export interface DataStudioDataset<R extends GridValidRowModel = any> {
  /**
   * Unique identifier for the dataset.
   */
  id: string;
  /**
   * Label displayed in the data sources tree.
   */
  label: React.ReactNode;
  /**
   * Columns rendered by the underlying Data Grid.
   */
  columns: GridColDef<R>[];
  /**
   * Static rows rendered by the underlying Data Grid.
   */
  rows?: GridRowsProp<R>;
  /**
   * Return the id of a given row.
   */
  getRowId?: DataGridProps<R>['getRowId'];
  /**
   * Field used by the server data source to identify rows.
   */
  rowIdField?: string;
  /**
   * Data Source used for server-side rows.
   */
  dataSource?: DataStudioDataSource;
  /**
   * Cache used by the Data Source layer.
   */
  dataSourceCache?: GridDataSourceCache | null;
  /**
   * Revalidation interval for Data Source rows.
   */
  dataSourceRevalidateMs?: DataGridProps<R>['dataSourceRevalidateMs'];
  /**
   * Callback fired when a Data Source request fails.
   * @param {GridGetRowsError | GridUpdateRowError} error The error returned by the Data Source layer.
   */
  onDataSourceError?: (error: GridGetRowsError | GridUpdateRowError) => void;
  /**
   * Callback fired when the user clicks the toolbar's "Add row" button.
   * When provided, the toolbar renders an "Add row" affordance next to the search input
   * while this dataset is active.
   * @returns {void | Promise<void>} Optionally a promise; the toolbar does not await it.
   */
  onAddRow?: () => void | Promise<void>;
  /**
   * Props forwarded to the component slots when this dataset is active.
   */
  slotProps?: DataStudioSlotProps<R>;
}

/**
 * Discriminator for `DataStudioView`. Defaults to `'grid'` when absent —
 * existing views (which have no `kind`) keep rendering the data grid.
 */
export type DataStudioViewKind = 'grid' | 'chart';

/**
 * Chart-specific configuration. Intentionally minimal for now; concrete fields
 * (chart type, x/y column refs, aggregation) land alongside real chart
 * rendering. A chart view stores its full shape on this object so view
 * persistence stays driven by `onViewsChange`.
 */
export interface DataStudioChartConfig {
  // Reserved.
}

export interface DataStudioView {
  /**
   * Unique identifier for the view.
   */
  id: string;
  /**
   * Label displayed in the view tab.
   */
  label: React.ReactNode;
  /**
   * Identifier of the dataset this view targets.
   * Must match an `id` from the `datasets` prop.
   */
  datasetId: string;
  /**
   * Kind of view; controls whether the active pane renders the data grid or a
   * chart workspace. When absent, the view behaves as a grid view (legacy).
   * @default 'grid'
   */
  kind?: DataStudioViewKind;
  /**
   * Initial Data Grid state applied while this view is active (filters, sort, columns, etc.).
   * Ignored when `kind === 'chart'`.
   */
  initialState?: GridInitialState;
  /**
   * Chart configuration. Ignored when `kind !== 'chart'`.
   */
  chartConfig?: DataStudioChartConfig;
}

export type DataStudioLayout = 'sidebar' | 'tabs';

export interface DataStudioProps<R extends GridValidRowModel = any> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'children'
> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DataStudioClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Datasets available in the studio.
   */
  datasets: DataStudioDataset<R>[];
  /**
   * MUI X plan to target. Selects the default Data Grid (community / Pro /
   * Premium) and whether the built-in chart workspace is active.
   *
   * Override the auto-resolved grid by passing `slots.dataGrid` explicitly;
   * the chart workspace can likewise be overridden via `slots.chartView`.
   * @default 'community'
   */
  plan?: DataStudioPlan;
  /**
   * If `true`, the data sources tree shows a loading state.
   * @default false
   */
  loading?: boolean;
  /**
   * The initially active dataset id.
   */
  initialDatasetId?: string;
  /**
   * The active dataset id.
   */
  activeDatasetId?: string;
  /**
   * Callback fired when the active dataset changes.
   * @param {string} datasetId The selected dataset id.
   * @param {DataStudioDataset<R>} dataset The selected dataset definition.
   */
  onActiveDatasetChange?: (datasetId: string, dataset: DataStudioDataset<R>) => void;
  /**
   * Overridable component slots.
   */
  slots?: DataStudioSlots;
  /**
   * Props forwarded to the component slots.
   */
  slotProps?: DataStudioSlotProps<R>;
  /**
   * Navigator layout.
   * - `'sidebar'`: tree navigator on the left.
   * - `'tabs'`: spreadsheet-style tab bar at the bottom.
   * @default 'sidebar'
   */
  layout?: DataStudioLayout;
  /**
   * Views displayed alongside datasets (controlled).
   * Each view targets a dataset and may carry an `initialState` applied to the Data Grid.
   */
  views?: DataStudioView[];
  /**
   * Initial views displayed alongside datasets (uncontrolled).
   * Ignored if `views` is provided.
   */
  defaultViews?: DataStudioView[];
  /**
   * Callback fired when the list of views changes (add, rename, duplicate, delete, reorder).
   * @param {DataStudioView[]} views The updated list of views.
   */
  onViewsChange?: (views: DataStudioView[]) => void;
  /**
   * Persistence adapter for the list of views. Hydrated once on mount and
   * called whenever the views list mutates (add, rename, duplicate, delete,
   * move, updateView). Pass `null` to disable persistence.
   *
   * Defaults to `createLocalStorageViewsPersistenceAdapter()` (localStorage,
   * namespace `'default'`) so views are remembered across reloads
   * out-of-the-box. Pass a custom adapter to back persistence with a server,
   * IndexedDB, etc.
   *
   * Ignored when the `views` prop is provided (controlled mode — the consumer
   * owns the source of truth).
   * @default createLocalStorageViewsPersistenceAdapter()
   */
  viewsPersistence?: DataStudioViewsPersistenceAdapter | null;
  /**
   * The active view id (controlled). Pass `null` to indicate a dataset tab is active.
   */
  activeViewId?: string | null;
  /**
   * The initially active view id (uncontrolled).
   */
  initialActiveViewId?: string | null;
  /**
   * Callback fired when the active view changes. `null` means a dataset tab became active.
   * @param {string | null} viewId The selected view id.
   * @param {DataStudioView | null} view The selected view definition.
   */
  onActiveViewChange?: (viewId: string | null, view: DataStudioView | null) => void;
  /**
   * Strategy applied to the Data Source cache used by every dataset.
   * See `DataStudioCacheStrategy` for the available values.
   * A `dataset.dataSourceCache` set on an individual dataset always takes precedence.
   * @default 'shared'
   */
  cacheStrategy?: DataStudioCacheStrategy;
  /**
   * Options forwarded to the shared session cache when `cacheStrategy === 'shared'`.
   * Ignored for the other strategies.
   */
  cacheOptions?: DataStudioSessionCacheOptions;
  /**
   * Routing adapter that mirrors the active dataset and view into an external
   * source (typically the URL query string). Pass
   * `createSearchParamsRoutingAdapter()` for a `window.history`-based default,
   * or implement the interface to integrate with Next.js / React Router / etc.
   *
   * Explicit `activeDatasetId` / `activeViewId` controlled props still win when set.
   */
  routing?: DataStudioRoutingAdapter | null;
  /**
   * Backend chat adapter that powers the Copilot panel. When set, Data Studio
   * mounts a right-side drawer with a Copilot panel and a trigger button in
   * the toolbar. Wrap with `createStudioCopilotLocalStorageAdapter` to add
   * conversation persistence.
   */
  copilotChatAdapter?: ChatAdapter;
  /**
   * Copilot plugins (PDF, formula, custom). Forwarded to the executor so the
   * agent's tool calls can be claimed by client-side renderers.
   */
  copilotPlugins?: ReadonlyArray<CopilotPlugin<any, any>>;
  /**
   * Feature flags controlling which Copilot capabilities are exposed. Lets
   * consumers turn off mutation classes (e.g. disable view CRUD, disable
   * data query) without rebuilding the command pack.
   */
  copilotFeatures?: Partial<StudioGuards>;
}
