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
import type { DataStudioDataSourceConnector } from '../createDataStudioDataSourceFromAPI';
import type { DataStudioToolbarProps } from '../DataStudioToolbar/DataStudioToolbar';
import type { DataStudioSessionCacheOptions } from './sessionCache';
import type { DataStudioRoutingAdapter } from './routing';
import type { DataStudioSheetsPersistenceAdapter } from './sheetsPersistence';
import type { DataStudioJointSourcesPersistenceAdapter } from './jointSourcesPersistence';
import type { DataStudioJoinDefinition } from '../models';
import type { DataStudioViewType } from '../viewRegistry';
import type { StudioCopilotPanelProps, StudioGuards } from '../copilot';

/**
 * Strategy applied to the Data Source cache used by every dataSource in a `<DataStudio>`.
 *
 * - `'shared'`: a single LRU cache (with per-dataSource namespacing) is shared across all dataSources.
 *   Switching dataSources/views reuses cached pages and one dataSource's mutation does not
 *   invalidate another dataSource's entries.
 * - `'per-dataSource'`: each dataSource gets its own `GridDataSourceCacheDefault` (the legacy
 *   Data Grid default).
 * - `'none'`: Data Source caching is disabled (`dataSourceCache={null}` is passed).
 *
 * A `dataSource.cache` set on an individual dataSource always takes precedence.
 */
export type DataStudioCacheStrategy = 'shared' | 'per-dataSource' | 'none';

/**
 * MUI X licensing tier the studio targets. Drives the default `dataGrid` slot
 * (DataGrid / DataGridPro / DataGridPremium).
 *
 * - `'community'`: free DataGrid.
 * - `'pro'`: DataGridPro.
 * - `'premium'`: DataGridPremium.
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
  dataSource?: DataStudioDataSourceConnector;
  dataSourceCache?: GridDataSourceCache | null;
  dataSourceRevalidateMs?: DataGridProps<R>['dataSourceRevalidateMs'];
  onDataSourceError?: (error: GridGetRowsError | GridUpdateRowError) => void;
}

export type DataStudioDataGridComponent = React.ElementType;

export type DataStudioToolbarComponent = React.ComponentType<DataStudioToolbarProps>;

export interface DataStudioSlots {
  /**
   * The Data Grid component used to render dataSources.
   * Use this slot to provide DataGridPro or DataGridPremium.
   * @default DataGrid
   */
  dataGrid?: DataStudioDataGridComponent;
  /**
   * The toolbar rendered between the view tab strip and the Data Grid.
   * Set to `null` to hide the toolbar.
   * @default DataStudioToolbar
   */
  toolbar?: DataStudioToolbarComponent | null;
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
   * Props forwarded to the toolbar slot.
   */
  toolbar?: Partial<Omit<DataStudioToolbarProps, 'apiRef'>>;
}

export interface DataStudioDataSource<R extends GridValidRowModel = any> {
  /**
   * Unique identifier for the data source.
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
   * Async row-fetching connector. Use [[createDataStudioDataSourceFromAPI]] to
   * build one from a Data Studio HTTP endpoint, or implement the interface
   * directly for custom backends.
   */
  connector?: DataStudioDataSourceConnector;
  /**
   * Cache used by the connector.
   */
  cache?: GridDataSourceCache | null;
  /**
   * Revalidation interval for connector-driven rows.
   */
  dataSourceRevalidateMs?: DataGridProps<R>['dataSourceRevalidateMs'];
  /**
   * Callback fired when a connector request fails.
   * @param {GridGetRowsError | GridUpdateRowError} error The error returned by the connector layer.
   */
  onDataSourceError?: (error: GridGetRowsError | GridUpdateRowError) => void;
  /**
   * Callback fired when the user clicks the toolbar's "Add row" button.
   * When provided, the toolbar renders an "Add row" affordance next to the search input
   * while this data source is active.
   * @returns {void | Promise<void>} Optionally a promise; the toolbar does not await it.
   */
  onAddRow?: () => void | Promise<void>;
  /**
   * Props forwarded to the component slots when this dataSource is active.
   */
  slotProps?: DataStudioSlotProps<R>;
  /**
   * Default chart configuration for this Data Source — the fields the built-in
   * Chart template should group by and aggregate. Populate it (e.g. from a
   * schema endpoint via `createDataStudioDataSourcesFromAPI`) to declare which
   * fields are good chart categories/measures **and** that the connector
   * supports server-side grouping by them — this lets server-backed charts
   * aggregate by default instead of plotting raw rows. When absent, the chart
   * falls back to a heuristic and only auto-aggregates client-side data.
   */
  chartDefaults?: DataStudioChartDefaults;
  /**
   * Whether the `connector` performs server-side row grouping + aggregation (so
   * charts can group/aggregate the **whole** dataset instead of sampling rows).
   * Forwarded from a schema descriptor's `capabilities` by
   * `createDataStudioDataSourcesFromAPI`. When `false`/absent, server-backed
   * charts fall back to a client-side sample.
   */
  supportsServerGrouping?: boolean;
  /**
   * Opaque token shared by data sources that can be joined together (e.g. all
   * tables on one SQL connection). The join builder only offers joins between
   * sources with the same `joinGroup`. Forwarded from the schema descriptor by
   * `createDataStudioDataSourcesFromAPI`. Absent for non-joinable sources.
   */
  joinGroup?: string;
}

/**
 * A user-authored joint source, persisted in the browser. Joint sources are
 * never defined in code — the user composes them in the UI from the registered
 * base data sources. Rehydrated into a runtime `DataStudioDataSource` by
 * `createDataStudioJointDataSource`.
 */
export interface DataStudioJointSourceConfig {
  /** Unique id (distinct from any base source id). */
  id: string;
  /** Display label shown in the data sources tree. */
  label: string;
  /** The join definition this source executes. */
  definition: DataStudioJoinDefinition;
}

/**
 * Declares the default chart grouping for a Data Source: the categorical fields
 * to group by (`dimensions`) and the numeric fields to sum (`values`).
 */
export interface DataStudioChartDefaults {
  /** Categorical field(s) the chart groups by (the server must support grouping by these). */
  dimensions?: string[];
  /** Numeric field(s) the chart aggregates (sum). */
  values?: string[];
}

/**
 * A user-created **view** of a dataset: one render of a data source as a grid,
 * chart, pivot table, or dashboard. Views are scoped to the data source named
 * by `dataSourceId` and surface as tabs across the top of that dataset (the
 * leading "Table" tab is implicit — it's the dataset's raw grid). A view with
 * `dataSourceId: null` is free-form (e.g. a blank spreadsheet).
 *
 * Named `DataStudioSheet` for backwards compatibility; prefer the
 * [[DataStudioView]] alias going forward. The two are identical.
 */
export interface DataStudioSheet {
  /**
   * Unique identifier for the sheet.
   */
  id: string;
  /**
   * Label displayed in the sidebar tree or tab bar.
   */
  label: React.ReactNode;
  /**
   * Identifier of the data source this sheet targets. `null` for free-form
   * sheets that don't bind to a data source.
   * Must match an `id` from the `dataSources` prop.
   */
  dataSourceId: string | null;
  /**
   * Initial Data Grid state applied while this sheet is active (filters, sort,
   * columns, etc.). Used by the built-in `'grid'` view type.
   */
  initialState?: GridInitialState;
  /**
   * Registry key that selects the view renderer (see `viewTypes` prop on
   * `<DataStudio>`). Defaults to `'grid'` when absent — the built-in data
   * grid renderer.
   *
   * Non-grid types render via the registered `DataStudioViewType.Component`.
   */
  type?: string;
  /**
   * Type-specific JSON params consumed by the view renderer. Ignored by the
   * built-in `'grid'` type, which reads from `initialState` directly.
   */
  params?: Record<string, unknown>;
}

/**
 * A user-created view of a dataset. Canonical alias of [[DataStudioSheet]] —
 * use this name in new code. Identical shape; the `Sheet` name is retained for
 * backwards compatibility.
 */
export type DataStudioView = DataStudioSheet;

/**
 * A view inside a Sheet: a JSON-defined window on data. Reserved for the view
 * registry from a later iteration. The `type` is a registry key; `params` is
 * type-specific JSON configuration.
 *
 * v1 Sheets render an implicit single `'grid'` view backed by `initialState`
 * on the Sheet itself; this type is exported so future templates / view types
 * can land without another rename.
 */
export interface DataStudioViewDefinition {
  /**
   * Unique identifier for the view (scoped to its parent Sheet).
   */
  id: string;
  /**
   * Label for the view (used inside multi-view Sheets in a later iteration).
   */
  label: string;
  /**
   * Registry key. In v1 only `'grid'` is recognized.
   */
  type: string;
  /**
   * Type-specific JSON params. Schema lives with the view registration.
   */
  params: Record<string, unknown>;
}

/**
 * Shape accepted by the `viewTypes` / `sheetTemplates` props. The built-in
 * defaults are always the starting point; this prop layers on top:
 *
 * - **omit it** — use the plan-appropriate built-ins untouched.
 * - **an array** — appended over the defaults; an entry sharing a built-in's
 *   key (`type` for view types, `id` for templates) replaces it in place.
 * - **a function** — receives the built-in defaults and returns the final set,
 *   for full add / remove / reorder control (e.g. `(d) => d.filter(...)`).
 */
export type DataStudioOverridable<T> = ReadonlyArray<T> | ((defaults: T[]) => ReadonlyArray<T>);

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
   * DataSources available in the studio.
   */
  dataSources: DataStudioDataSource<R>[];
  /**
   * MUI X plan to target. Selects the default Data Grid (community / Pro /
   * Premium).
   *
   * Override the auto-resolved grid by passing `slots.dataGrid` explicitly.
   * @default 'community'
   */
  plan?: DataStudioPlan;
  /**
   * If `true`, the data sources tree shows a loading state.
   * @default false
   */
  loading?: boolean;
  /**
   * The initially active dataSource id.
   */
  initialDataSourceId?: string;
  /**
   * The active dataSource id.
   */
  activeDataSourceId?: string;
  /**
   * Callback fired when the active dataSource changes.
   * @param {string} dataSourceId The selected dataSource id.
   * @param {DataStudioDataSource<R>} dataSource The selected dataSource definition.
   */
  onActiveDataSourceChange?: (dataSourceId: string, dataSource: DataStudioDataSource<R>) => void;
  /**
   * Overridable component slots.
   */
  slots?: DataStudioSlots;
  /**
   * Props forwarded to the component slots.
   */
  slotProps?: DataStudioSlotProps<R>;
  /**
   * The dataset views (controlled). Each view targets a dataset via
   * `dataSourceId` (or is free-form) and surfaces as a tab across the top of
   * that dataset.
   */
  views?: DataStudioView[];
  /**
   * The initial dataset views (uncontrolled). Ignored if `views` is provided.
   */
  defaultViews?: DataStudioView[];
  /**
   * Callback fired when the list of views changes (add, rename, duplicate, delete, reorder).
   * @param {DataStudioView[]} views The updated list of views.
   */
  onViewsChange?: (views: DataStudioView[]) => void;
  /**
   * The dataset views (controlled).
   * @deprecated Use `views` instead. Retained for backwards compatibility.
   */
  sheets?: DataStudioSheet[];
  /**
   * The initial dataset views (uncontrolled). Ignored if `views`/`sheets` is provided.
   * @deprecated Use `defaultViews` instead. Retained for backwards compatibility.
   */
  defaultSheets?: DataStudioSheet[];
  /**
   * Callback fired when the list of views changes.
   * @deprecated Use `onViewsChange` instead. Retained for backwards compatibility.
   * @param {DataStudioSheet[]} sheets The updated list of views.
   */
  onSheetsChange?: (sheets: DataStudioSheet[]) => void;
  /**
   * Persistence adapter for the list of sheets. Hydrated once on mount and
   * called whenever the sheets list mutates (add, rename, duplicate, delete,
   * move, updateSheet). Pass `null` to disable persistence.
   *
   * Defaults to `createLocalStorageSheetsPersistenceAdapter()` (localStorage,
   * namespace `'default'`) so sheets are remembered across reloads
   * out-of-the-box. Pass a custom adapter to back persistence with a server,
   * IndexedDB, etc.
   *
   * Ignored when the `sheets` prop is provided (controlled mode — the consumer
   * owns the source of truth).
   * @default createLocalStorageSheetsPersistenceAdapter()
   */
  sheetsPersistence?: DataStudioSheetsPersistenceAdapter | null;
  /**
   * Adapter persisting the user's joint sources (created in the UI from the base
   * `dataSources`). Defaults to a `localStorage` adapter so joint sources are
   * remembered across reloads. Pass `null` to disable persistence, or a custom
   * adapter to back it with a server, IndexedDB, etc.
   * @default createLocalStorageJointSourcesPersistenceAdapter()
   */
  jointSourcesPersistence?: DataStudioJointSourcesPersistenceAdapter | null;
  /**
   * The active view id (controlled). Pass `null` to select the dataset's
   * implicit "Table" view (its raw grid).
   */
  activeViewId?: string | null;
  /**
   * The initially active view id (uncontrolled). `null` selects the Table view.
   */
  initialActiveViewId?: string | null;
  /**
   * Callback fired when the active view changes. `null` means the dataset's
   * Table view became active.
   * @param {string | null} viewId The selected view id.
   * @param {DataStudioView | null} view The selected view definition.
   */
  onActiveViewChange?: (viewId: string | null, view: DataStudioView | null) => void;
  /**
   * The active view id (controlled). Pass `null` to select the Table view.
   * @deprecated Use `activeViewId` instead. Retained for backwards compatibility.
   */
  activeSheetId?: string | null;
  /**
   * The initially active view id (uncontrolled).
   * @deprecated Use `initialActiveViewId` instead. Retained for backwards compatibility.
   */
  initialActiveSheetId?: string | null;
  /**
   * Callback fired when the active view changes. `null` means the Table view became active.
   * @deprecated Use `onActiveViewChange` instead. Retained for backwards compatibility.
   * @param {string | null} sheetId The selected view id.
   * @param {DataStudioSheet | null} sheet The selected view definition.
   */
  onActiveSheetChange?: (sheetId: string | null, sheet: DataStudioSheet | null) => void;
  /**
   * Strategy applied to the Data Source cache used by every dataSource.
   * See `DataStudioCacheStrategy` for the available values.
   * A `dataSource.cache` set on an individual dataSource always takes precedence.
   * @default 'shared'
   */
  cacheStrategy?: DataStudioCacheStrategy;
  /**
   * Options forwarded to the shared session cache when `cacheStrategy === 'shared'`.
   * Ignored for the other strategies.
   */
  cacheOptions?: DataStudioSessionCacheOptions;
  /**
   * Routing adapter that mirrors the active dataSource and sheet into an external
   * source (typically the URL query string). Pass
   * `createSearchParamsRoutingAdapter()` for a `window.history`-based default,
   * or implement the interface to integrate with Next.js / React Router / etc.
   *
   * Explicit `activeDataSourceId` / `activeSheetId` controlled props still win when set.
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
  /**
   * View types that render a Sheet's content area, keyed by `sheet.type`
   * (defaulting to the inline `'grid'` renderer). The plan-appropriate
   * built-ins (Spreadsheet always; Pivot + Chart on `plan="premium"`) are
   * active by default — omit this prop to use them as-is.
   *
   * Pass an array to add or override-by-`type`, or a `(defaults) => [...]`
   * function to add / remove / reorder. Unknown types render a friendly
   * fallback. The AI agent can inspect each type's `paramsSchema` to construct
   * valid `sheet.params` payloads.
   * @default getBuiltinViewTypes(plan)
   */
  viewTypes?: DataStudioOverridable<DataStudioViewType>;
  /**
   * Sheet templates surfaced in the Composer (the empty-state main screen).
   * Each template builds a `DataStudioSheet` from an optional active Data
   * Source, then the Composer hands the result to `addSheet`.
   *
   * The plan-appropriate built-ins (Spreadsheet always; Pivot + Chart on
   * `plan="premium"`) are active by default — omit this prop to use them
   * as-is. Pass an array to add or override-by-`id`, or a `(defaults) => [...]`
   * function to add / remove / reorder.
   * @default getBuiltinSheetTemplates(plan)
   */
  sheetTemplates?: DataStudioOverridable<DataStudioSheetTemplate>;
}

/**
 * Template surfaced in the Composer. `build` returns a partially-shaped
 * `DataStudioSheet` (missing `id`, which the state hook synthesizes); the
 * Composer hands it to `state.addSheet`.
 */
export interface DataStudioSheetTemplate {
  /** Stable identifier. */
  id: string;
  /** Card label. */
  label: string;
  /** Short subtitle / description rendered under the label. */
  description?: string;
  /** Icon component for the card. */
  icon?: React.ComponentType;
  /**
   * Factory for the new sheet. The composer passes the currently active
   * Data Source id (if any) — templates may use it to bind the sheet, or
   * ignore it for free-form sheets.
   * @param {object} input Build options.
   * @param {string | null | undefined} input.dataSourceId Currently active
   *   data source id (or `null` when free-form).
   * @returns {Omit<DataStudioSheet, 'id'>} The new sheet's shape (sans `id`).
   */
  build(input: { dataSourceId: string | null | undefined }): Omit<DataStudioSheet, 'id'>;
}
