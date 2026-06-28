import type {
  GridColDef,
  GridGetRowsParams,
  GridGetRowsResponse,
  GridRowId,
  GridRowModel,
  GridUpdateRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import type { DataStudioChartDefaults } from './DataStudio/DataStudio.types';

export const DATA_STUDIO_PROTOCOL_VERSION = 1;

/**
 * Synthetic group row identifier field set by the server.
 * Clients prefer this field over the dataSource's `rowIdField` when building `getRowId`,
 * so the synthetic id never leaks into the visible row-id column.
 */
export const DATA_STUDIO_SYNTHETIC_ID_FIELD = '__dataStudioSyntheticId';

export interface DataStudioDataSourceCapabilities {
  filtering: boolean;
  sorting: boolean;
  pagination: boolean;
  lazyLoading: boolean;
  editing: boolean;
  createRow: boolean;
  updateRow: boolean;
  deleteRow: boolean;
  rowGrouping: boolean;
  aggregation: boolean;
  pivoting: boolean;
}

export type DataStudioRowMutationAction = 'createRow' | 'updateRow' | 'deleteRow';

export type DataStudioEndpointAction = 'schema' | 'rows' | DataStudioRowMutationAction;

export interface DataStudioDataSourceAccessors {
  groupKeyField?: string;
  childrenCountField?: string;
  aggregatedValueFields?: Record<string, string>;
  aggregatedValueFieldPattern?: string;
}

export interface DataStudioPivotModel {
  rows: Array<Record<string, unknown> & { field: string }>;
  columns: Array<Record<string, unknown> & { field: string }>;
  values: Array<Record<string, unknown> & { field: string }>;
}

/**
 * Server-side binning directive for a grouped field: the connector groups by the
 * bucket of the field's value rather than its raw value (e.g. by month). Lets a
 * server-backed chart roll a date column up without fetching the raw rows.
 */
export type DataStudioBinDirective =
  | {
      kind: 'date';
      granularity: 'day' | 'month' | 'quarter' | 'year';
    }
  | {
      /** Bucket a numeric column into `bins` equal-width brackets (server computes the range). */
      kind: 'numeric';
      bins: number;
    };

/**
 * A single `ON` equality between a base (fact) field and a joined (dimension)
 * field. `leftField` belongs to the join's base source; `rightField` to the
 * joined source.
 */
export interface DataStudioJoinKeyPair {
  leftField: string;
  rightField: string;
}

/** Join type. `full` is `FULL OUTER JOIN`. */
export type DataStudioJoinType = 'inner' | 'left' | 'right' | 'full';

/** One table joined onto the base source. */
export interface DataStudioJoinClause {
  /** Id of the joined (dimension) data source. */
  sourceId: string;
  type: DataStudioJoinType;
  /** Equality key pairs combined with `AND`. */
  on: DataStudioJoinKeyPair[];
}

/** A single output column of a joint source, aliased to a flat field name. */
export interface DataStudioJoinColumn {
  /** Id of the data source the column comes from. */
  sourceId: string;
  field: string;
  /** Flat output field name (must be unique across the joint source). */
  as: string;
}

/**
 * Declarative definition of a "joint source": a base (fact) source joined to one
 * or more other sources sharing the same backend, projected to a flat set of
 * aliased output columns. Authored in the UI and sent to the server on the rows
 * request (`DataStudioGetRowsParams.join`); the base source executes it.
 */
export interface DataStudioJoinDefinition {
  /** Id of the base (fact) data source the request is routed to. */
  base: string;
  joins: DataStudioJoinClause[];
  columns: DataStudioJoinColumn[];
}

export interface DataStudioGetRowsParams extends GridGetRowsParams {
  groupKeys?: string[];
  groupFields?: GridColDef['field'][];
  aggregationModel?: Record<string, string>;
  pivotModel?: DataStudioPivotModel;
  /** Per-field server-side binning (groups by a bucket expression). */
  binning?: Record<string, DataStudioBinDirective>;
  /**
   * When set, the request is served from a "joint source": the base source
   * joins the referenced sources and runs the query over the joined result.
   */
  join?: DataStudioJoinDefinition;
}

export interface DataStudioPivotColumn {
  key: string;
  group: string | GridRowModel;
  children?: DataStudioPivotColumn[];
}

export interface DataStudioGetRowsResponse extends GridGetRowsResponse {
  aggregateRow?: GridValidRowModel;
  pivotColumns?: DataStudioPivotColumn[];
}

export interface DataStudioDataSourceDescriptor<R extends GridValidRowModel = any> {
  id: string;
  label: string;
  columns: GridColDef<R>[];
  rowIdField?: string;
  rowCount?: number;
  capabilities: DataStudioDataSourceCapabilities;
  accessors?: DataStudioDataSourceAccessors;
  endpoints?: {
    rows?: string;
    createRow?: string;
    updateRow?: string;
    deleteRow?: string;
  };
  /**
   * Default chart grouping for this Data Source. Forwarded to the resulting
   * `DataStudioDataSource.chartDefaults` so server-backed charts aggregate by
   * the declared fields (which the connector must support grouping by).
   */
  chartDefaults?: DataStudioChartDefaults;
  /**
   * Opaque token shared by data sources that can be joined together (e.g. all
   * tables on one SQL connection). The join builder only offers joins between
   * sources with the same `joinGroup`. Sources without one are not joinable.
   */
  joinGroup?: string;
  meta?: Record<string, unknown>;
}

export interface DataStudioSchemaResponse<R extends GridValidRowModel = any> {
  version: typeof DATA_STUDIO_PROTOCOL_VERSION;
  dataSources: DataStudioDataSourceDescriptor<R>[];
}

export interface DataStudioRowsRequest {
  version: typeof DATA_STUDIO_PROTOCOL_VERSION;
  dataSourceId: string;
  params: DataStudioGetRowsParams;
}

export interface DataStudioCreateRowRequest {
  version: typeof DATA_STUDIO_PROTOCOL_VERSION;
  dataSourceId: string;
  row: GridRowModel;
}

export interface DataStudioUpdateRowRequest {
  version: typeof DATA_STUDIO_PROTOCOL_VERSION;
  dataSourceId: string;
  params: GridUpdateRowParams;
}

export interface DataStudioDeleteRowRequest {
  version: typeof DATA_STUDIO_PROTOCOL_VERSION;
  dataSourceId: string;
  rowId: GridRowId;
  row?: GridRowModel;
}

export type DataStudioRowsResponse = DataStudioGetRowsResponse;

export type DataStudioRowMutationResponse = GridRowModel;
