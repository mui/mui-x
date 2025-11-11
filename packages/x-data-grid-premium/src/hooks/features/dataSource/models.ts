import type {
  GridColDef,
  GridRowId,
  GridValidRowModel,
  GridDataSource,
  GridGetRowsResponse,
  GridGetRowsParams,
  GridDataSourceApiBase,
  GridDataSourcePrivateApi,
  GridRowModel,
} from '@mui/x-data-grid-pro';
import type { GridDataSourceFetchRowsParams } from '@mui/x-data-grid-pro/internals';

import type { GridAggregationModel } from '../aggregation/gridAggregationInterfaces';
import type { GridPivotModel } from '../pivoting/gridPivotingInterfaces';

export interface GridGetRowsResponsePivotColumn {
  key: string;
  group: string | GridRowModel;
  children?: GridGetRowsResponsePivotColumn[];
}

/**
 * Path to a pivot column group.
 * @param {string} key Pivot column key.
 * @param {string} field Pivot column field.
 * @param {string | GridRowModel} value Path value that is either a string or a part of row model needed to get the formatted value of the original column.
 */
export interface GridDataSourcePivotColumnGroupPath {
  key: string;
  field: string;
  value: string | GridRowModel;
}

export interface GridGetRowsResponsePremium extends GridGetRowsResponse {
  /**
   * Row to be used for aggregation footer row.
   * It must provide the values for the aggregated columns passed in
   * `GridGetRowsParams.aggregationModel`.
   */
  aggregateRow?: GridValidRowModel;
  /**
   * Defines the structure of pivot columns to be created from the pivoted data.
   * Each node in the tree must have a `key` and `group` property.
   * `key` is used to identify the column group and will be passed to the `pivotingColDef` callback as the column path parameter.
   * `group` is either a string or a part of a row model needed to get the formatted value of the original column.
   * optionally,`children` is a list of the next level nodes.
   * Each node at the last level of the tree will be a column group containing each pivot value as a column.
   *
   * Structure:
   * The `group` property can be a string or an object:
   *   - Strings are used directly as column group header names (e.g. `"2025"`, `"January"`)
   *   - Objects contain data that will be formatted into header names using the column's valueFormatter or valueGetter
   *     (e.g. `{date: "2025-01-01"}` could be formatted as `"Jan 2025"`)
   *
   * Examples:
   * - `[{key: "Y", group: "Yes"}, {key: "N", group: "No"}]` - Creates column groups with values "Yes" and "No"
   * - `[{key: "2025", group: "2025", children: [{key: "January", group: "January"}, {key: "February", group: "February"}]}]` - Creates a column group with value "2025"
   *   that has column groups "January" and "February"
   * - `[
   *      {key: "2025-01", group: {date: "2025-01-01"}, children: [{key: "01", group: {date: "2025-01-01"}}]},
   *      {key: "2025-02", group: {date: "2025-02-01"}, children: [{key: "02", group: {date: "2025-02-01"}}]},
   *    ]` - Creates two levels of column groups with values returned from the value formatters of the columns used for pivoting.
   *   Even though the same values are passed, the header names can be different based on the valueFormatter or valueGetter.
   *   One pivoting column may format the date as a year and the other as a month.
   */
  pivotColumns?: GridGetRowsResponsePivotColumn[];
}

export interface GridGetRowsParamsPremium extends GridGetRowsParams {
  /**
   * List of aggregated columns.
   */
  aggregationModel?: GridAggregationModel;
  /**
   * List of grouped columns (only applicable with `rowGrouping`).
   */
  groupFields?: GridColDef['field'][];
  /**
   * Visible rows, columns and values from the pivot model (only applicable with `pivoting`).
   */
  pivotModel?: {
    columns: Omit<GridPivotModel['columns'], 'hidden'>;
    rows: Omit<GridPivotModel['rows'], 'hidden'>;
    values: Omit<GridPivotModel['values'], 'hidden'>;
  };
}

export interface GridDataSourcePremium extends Omit<GridDataSource, 'getRows'> {
  /**
   * This method will be called when the grid needs to fetch some rows.
   * @param {GridGetRowsParamsPremium} params The parameters required to fetch the rows.
   * @returns {Promise<GridGetRowsResponsePremium>} A promise that resolves to the data of type [GridGetRowsResponsePremium].
   */
  getRows(params: GridGetRowsParamsPremium): Promise<GridGetRowsResponsePremium>;
  /**
   * Used to get the aggregated value for a parent row.
   * @param {GridValidRowModel} row The row to extract the aggregated value from.
   * @param {GridColDef['field']} field The field to extract the aggregated value for.
   * @returns {string} The aggregated value for a specific aggregated column.
   */
  getAggregatedValue?: (row: GridValidRowModel, field: GridColDef['field']) => string;
}

export interface GridDataSourceApiBasePremium extends Omit<GridDataSourceApiBase, 'fetchRows'> {
  /**
   * Fetches the rows from the server.
   * If no `parentId` option is provided, it fetches the root rows.
   * Any missing parameter from `params` will be filled from the state (sorting, filtering, etc.).
   * @param {GridRowId} parentId The id of the parent node (default: `GRID_ROOT_GROUP_ID`).
   * @param {GridDataSourceFetchRowsParams<GridGetRowsParamsPremium>} params Request parameters override.
   * @returns {Promise<void>} A promise that resolves when the rows are fetched.
   */
  fetchRows: (
    parentId?: GridRowId,
    params?: GridDataSourceFetchRowsParams<GridGetRowsParamsPremium>,
  ) => Promise<void>;
}

export interface GridDataSourceApiPremium {
  /**
   * The data source API.
   */
  dataSource: GridDataSourceApiBasePremium;
}

export interface GridDataSourcePremiumPrivateApi extends GridDataSourcePrivateApi {
  resolveGroupAggregation: (groupId: GridRowId, field: string) => any;
}
