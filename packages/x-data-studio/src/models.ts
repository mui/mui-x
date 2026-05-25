import type {
  GridColDef,
  GridGetRowsParams,
  GridGetRowsResponse,
  GridRowId,
  GridRowModel,
  GridUpdateRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';

export const DATA_STUDIO_PROTOCOL_VERSION = 1;

/**
 * Synthetic group row identifier field set by the server.
 * Clients prefer this field over the dataset's `rowIdField` when building `getRowId`,
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

export interface DataStudioGetRowsParams extends GridGetRowsParams {
  groupKeys?: string[];
  groupFields?: GridColDef['field'][];
  aggregationModel?: Record<string, string>;
  pivotModel?: DataStudioPivotModel;
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
