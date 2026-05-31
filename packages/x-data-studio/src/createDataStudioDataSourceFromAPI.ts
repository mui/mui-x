import type {
  GridDataSource,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridUpdateRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import {
  DATA_STUDIO_PROTOCOL_VERSION,
  type DataStudioCreateRowRequest,
  type DataStudioDataSourceAccessors,
  type DataStudioDeleteRowRequest,
  type DataStudioGetRowsParams,
  type DataStudioGetRowsResponse,
  type DataStudioRowsRequest,
  type DataStudioUpdateRowRequest,
} from './models';

export interface DataStudioDataSourceConnector extends Omit<GridDataSource, 'getRows'> {
  /**
   * Loads rows through a Data Studio rows endpoint.
   * @param {DataStudioGetRowsParams} params The parameters required to fetch rows.
   * @returns {Promise<DataStudioGetRowsResponse>} Rows, row count, and optional Premium response data.
   */
  getRows(params: DataStudioGetRowsParams): Promise<DataStudioGetRowsResponse>;
  /**
   * Gets the server-side row grouping key for a row.
   * @param {GridValidRowModel} row Row model.
   * @returns {string} Group key.
   */
  getGroupKey?: (row: GridValidRowModel) => string;
  /**
   * Gets the server-side children count for a group row.
   * @param {GridValidRowModel} row Row model.
   * @returns {number} Children count, or -1 when unknown.
   */
  getChildrenCount?: (row: GridValidRowModel) => number;
  /**
   * Gets the server-side aggregated value for an aggregated field.
   * @param {GridValidRowModel} row Row model.
   * @param {GridColDef['field']} field Aggregated field.
   * @returns {any} Aggregated value.
   */
  getAggregatedValue?: (row: GridValidRowModel, field: GridColDef['field']) => any;
  /**
   * Creates a row through a Data Studio mutation endpoint.
   * @param {GridRowModel} row Row model to create.
   * @returns {Promise<GridRowModel>} Created row model returned by the server.
   */
  createRow?: (row: GridRowModel) => Promise<GridRowModel>;
  /**
   * Deletes a row through a Data Studio mutation endpoint.
   * @param {GridRowId} rowId Identifier of the row to delete.
   * @param {GridRowModel} row Optional current row model.
   * @returns {Promise<GridRowModel>} Deleted row marker returned by the server.
   */
  deleteRow?: (rowId: GridRowId, row?: GridRowModel) => Promise<GridRowModel>;
}

export interface CreateDataStudioDataSourceFromAPIOptions {
  /**
   * Data source identifier sent to the remote Data Studio endpoint.
   */
  dataSourceId: string;
  /**
   * URL used to fetch rows from the remote Data Studio endpoint.
   */
  rowsUrl: string;
  /**
   * URL used to create rows from the remote Data Studio endpoint.
   */
  createRowUrl?: string;
  /**
   * URL used to update rows from the remote Data Studio endpoint.
   */
  updateRowUrl?: string;
  /**
   * URL used to delete rows from the remote Data Studio endpoint.
   */
  deleteRowUrl?: string;
  /**
   * Field accessors used by DataGridPro and DataGridPremium server-side grouping,
   * aggregation, and pivoting.
   */
  accessors?: DataStudioDataSourceAccessors;
  /**
   * Fetch implementation used by the client helper.
   * @default fetch
   */
  fetch?: typeof fetch;
}

function createRowsRequest(
  dataSourceId: string,
  params: DataStudioGetRowsParams,
): DataStudioRowsRequest {
  return {
    version: DATA_STUDIO_PROTOCOL_VERSION,
    dataSourceId,
    params,
  };
}

function createCreateRowRequest(
  dataSourceId: string,
  row: GridRowModel,
): DataStudioCreateRowRequest {
  return {
    version: DATA_STUDIO_PROTOCOL_VERSION,
    dataSourceId,
    row,
  };
}

function createUpdateRowRequest(
  dataSourceId: string,
  params: GridUpdateRowParams,
): DataStudioUpdateRowRequest {
  return {
    version: DATA_STUDIO_PROTOCOL_VERSION,
    dataSourceId,
    params,
  };
}

function createDeleteRowRequest(
  dataSourceId: string,
  rowId: GridRowId,
  row?: GridRowModel,
): DataStudioDeleteRowRequest {
  return {
    version: DATA_STUDIO_PROTOCOL_VERSION,
    dataSourceId,
    rowId,
    row,
  };
}

async function postDataStudioRequest<TResponse>(
  options: CreateDataStudioDataSourceFromAPIOptions,
  url: string,
  body: unknown,
  operation: string,
) {
  const fetchFn = options.fetch ?? fetch;
  const response = await fetchFn(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorMessage = await readRemoteErrorMessage(response);

    throw new Error(
      `MUI X Data Studio: The remote ${operation} request failed with status ${response.status}.
This prevents Data Studio from syncing the active data source.
Ensure the endpoint at "${url}" returns a successful Data Studio payload.${
        errorMessage ? `\nServer error: ${errorMessage}` : ''
      }`,
    );
  }

  return response.json() as Promise<TResponse>;
}

async function readRemoteErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { error?: unknown };

    return typeof body.error === 'string' ? body.error : undefined;
  } catch {
    return undefined;
  }
}

function getFieldValue(row: GridValidRowModel, field: string) {
  return row[field as keyof typeof row];
}

function createGroupKeyAccessor(accessors: DataStudioDataSourceAccessors | undefined) {
  if (!accessors?.groupKeyField) {
    return undefined;
  }

  return (row: GridValidRowModel) => String(getFieldValue(row, accessors.groupKeyField!) ?? '');
}

function createChildrenCountAccessor(accessors: DataStudioDataSourceAccessors | undefined) {
  if (!accessors?.childrenCountField) {
    return undefined;
  }

  return (row: GridValidRowModel) => {
    const value = getFieldValue(row, accessors.childrenCountField!);
    // Leaf rows do not carry the children-count field. Returning `-1` would tell
    // the data grid "group with unknown count" and render an expand caret on
    // every leaf. Treat a missing value as `0` (true leaf) and reserve `-1` for
    // values that are present but non-numeric.
    if (value == null) {
      return 0;
    }
    const count = Number(value);
    return Number.isFinite(count) ? count : -1;
  };
}

function createAggregatedValueAccessor(accessors: DataStudioDataSourceAccessors | undefined) {
  if (!accessors?.aggregatedValueFields && !accessors?.aggregatedValueFieldPattern) {
    return undefined;
  }

  return (row: GridValidRowModel, field: GridColDef['field']) => {
    const valueField =
      accessors.aggregatedValueFields?.[field] ??
      accessors.aggregatedValueFieldPattern?.replace('{field}', field);

    return valueField ? getFieldValue(row, valueField) : undefined;
  };
}

/**
 * Creates a Data Grid Data Source that loads rows from a Data Studio HTTP endpoint.
 */
export function createDataStudioDataSourceFromAPI(
  options: CreateDataStudioDataSourceFromAPIOptions,
): DataStudioDataSourceConnector {
  const dataSource: DataStudioDataSourceConnector = {
    async getRows(params) {
      return postDataStudioRequest<DataStudioGetRowsResponse>(
        options,
        options.rowsUrl,
        createRowsRequest(options.dataSourceId, params),
        'data source rows',
      );
    },
  };
  const getGroupKey = createGroupKeyAccessor(options.accessors);
  const getChildrenCount = createChildrenCountAccessor(options.accessors);
  const getAggregatedValue = createAggregatedValueAccessor(options.accessors);

  if (getGroupKey) {
    dataSource.getGroupKey = getGroupKey;
  }

  if (getChildrenCount) {
    dataSource.getChildrenCount = getChildrenCount;
  }

  if (getAggregatedValue) {
    dataSource.getAggregatedValue = getAggregatedValue;
  }

  if (options.createRowUrl) {
    dataSource.createRow = (row) =>
      postDataStudioRequest<GridRowModel>(
        options,
        options.createRowUrl!,
        createCreateRowRequest(options.dataSourceId, row),
        'createRow',
      );
  }

  if (options.updateRowUrl) {
    dataSource.updateRow = (params) =>
      postDataStudioRequest<GridRowModel>(
        options,
        options.updateRowUrl!,
        createUpdateRowRequest(options.dataSourceId, params),
        'updateRow',
      );
  }

  if (options.deleteRowUrl) {
    dataSource.deleteRow = (rowId, row) =>
      postDataStudioRequest<GridRowModel>(
        options,
        options.deleteRowUrl!,
        createDeleteRowRequest(options.dataSourceId, rowId, row),
        'deleteRow',
      );
  }

  return dataSource;
}
