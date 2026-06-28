import type * as React from 'react';
import type {
  DataStudioDataSource,
  DataStudioPlan,
  DataStudioSheet,
} from '../DataStudio/DataStudio.types';

/**
 * Props passed to a view type's `Component`. View types are how non-grid
 * renderers (chart, pivot, dashboards, …) plug into Data Studio.
 *
 * The built-in `'grid'` type does NOT use this — DataStudio renders the data
 * grid inline because it owns the grid's `apiRef`, slot props, cache, and
 * row-editing column decoration. The registry covers everything else.
 */
export interface DataStudioViewRenderProps<TParams = Record<string, unknown>> {
  /**
   * The active Sheet being rendered.
   */
  sheet: DataStudioSheet;
  /**
   * The Data Source the Sheet is bound to. `null` for free-form Sheets.
   */
  dataSource: DataStudioDataSource | null;
  /**
   * All available Data Sources, so a view can offer a Data Source picker (e.g.
   * the Chart view lets the user re-point it at another Source). Use together
   * with `onChangeDataSource`.
   */
  dataSources: DataStudioDataSource[];
  /**
   * Re-bind this Sheet to another Data Source (or `null` to unbind). Resets the
   * Sheet's params so the view re-seeds sensible defaults for the new Source.
   * @param {string | null} dataSourceId The Data Source to bind to.
   */
  onChangeDataSource?: (dataSourceId: string | null) => void;
  /**
   * The Sheet's current `params` (from `sheet.params`).
   */
  params: TParams;
  /**
   * Patch the Sheet's params. Calls `state.updateSheet(sheet.id, { params })`
   * with `{ ...sheet.params, ...next }`.
   * @param {Partial<TParams>} next The params to merge into the Sheet.
   */
  setParams: (next: Partial<TParams>) => void;
  /**
   * The studio's licensing tier (`<DataStudio plan>`). View types use it to
   * light up plan-gated capabilities — e.g. the spreadsheet uses DataGridPremium
   * cell-range selection + clipboard on `'premium'`, and a basic editable grid
   * otherwise.
   */
  plan: DataStudioPlan;
  /**
   * DataStudio's shared Data Grid `apiRef`. A `gridBacked` view type (see
   * `DataStudioViewType.gridBacked`) should pass this to its `<DataGrid>` so the
   * Data Studio menu bar / toolbar bind to the view's grid — making File →
   * Download, View → Density, etc. act on the view. Non-grid views can ignore it.
   */
  apiRef: React.RefObject<any>;
  /**
   * Create (and activate) a new Sheet from this view — e.g. the Pivot view uses
   * it to spin up a chart seeded from its current pivot configuration. Defaults
   * the binding to the current Sheet's Data Source when `dataSourceId` is omitted.
   * @param {object} request The Sheet to create.
   * @param {string} request.type The view type for the new Sheet (e.g. `'chart'`).
   * @param {string} [request.label] Optional Sheet label.
   * @param {Record<string, unknown>} [request.params] Optional initial Sheet params.
   * @param {string | null} [request.dataSourceId] Optional Data Source binding override.
   */
  onCreateSheet?: (request: {
    type: string;
    label?: string;
    params?: Record<string, unknown>;
    dataSourceId?: string | null;
  }) => void;
}

/**
 * A registered view type. Look it up via `sheet.type` (defaults to `'grid'`).
 *
 * The built-in `'grid'` type is rendered inline by `<DataStudio>`. Consumers
 * pass additional view types via the `viewTypes` prop; the AI agent can
 * inspect their `paramsSchema` to construct JSON view definitions.
 */
export interface DataStudioViewType<TParams = Record<string, unknown>> {
  /**
   * Registry key. Matched against `sheet.type`. Conventionally lowercase
   * (`'chart'`, `'pivot'`, `'spreadsheet'`).
   */
  type: string;
  /**
   * Default label used when creating new Sheets of this type. The actual
   * Sheet's `label` always wins; this seeds the default.
   */
  defaultLabel?: string;
  /**
   * Optional icon for the sidebar / tabs. Reserved — not yet wired to the
   * tree/tab renderers.
   */
  icon?: React.ComponentType;
  /**
   * Params JSON schema. Consumed by the AI agent to construct valid
   * `sheet.params`. Optional — if absent, the agent treats params as opaque.
   */
  paramsSchema?: object;
  /**
   * React component that renders the Sheet's content area.
   */
  Component: React.ComponentType<DataStudioViewRenderProps<TParams>>;
  /**
   * Set to `true` when the view renders a Data Grid bound to the shared
   * `apiRef` from `DataStudioViewRenderProps`. DataStudio then keeps the menu
   * bar / toolbar active for the view (File → Download, View → Density, …) and
   * lets them act on the view's grid. Defaults to `false` (the menu bar / toolbar
   * show their disabled state while a non-grid view is active).
   * @default false
   */
  gridBacked?: boolean;
  /**
   * Set to `true` when the view renders its own toolbar and the Data Studio
   * grid toolbar (sort / filter / pivot / aggregation / export) would be noise.
   * DataStudio then hides its toolbar while this view is active (the menu bar is
   * unaffected). The built-in spreadsheet uses this — its free-form grid has no
   * sorting/filtering/pivoting, and it ships its own "+ Column / + Row" toolbar.
   * @default false
   */
  ownsToolbar?: boolean;
}

/**
 * Resolve a view type from a registry by its key.
 *
 * @param {ReadonlyArray<DataStudioViewType>} viewTypes Registered types.
 * @param {string | undefined} type The Sheet's type. Treated as `'grid'` when absent.
 * @returns {DataStudioViewType | undefined} The matching view type, or `undefined` when
 *   the type is `'grid'` (built-in) or unknown.
 */
export function resolveDataStudioViewType(
  viewTypes: ReadonlyArray<DataStudioViewType> | undefined,
  type: string | undefined,
): DataStudioViewType | undefined {
  if (!type || type === 'grid' || !viewTypes) {
    return undefined;
  }
  return viewTypes.find((vt) => vt.type === type);
}
