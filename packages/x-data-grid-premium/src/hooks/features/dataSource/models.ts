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

import type { GridAggregationModel } from '../aggregation/gridAggregationInterfaces';
import type { GridPivotModel } from '../pivoting/gridPivotingInterfaces';

export interface GridGetRowsResponsePivotColumn {
  group: string | GridRowModel;
  children?: GridGetRowsResponsePivotColumn[];
}

/**
 * Path to a pivot column group.
 * @param {string} field Pivot column field.
 * @param {string | GridRowModel} value Path value that is either a string or a part of row model needed to get the formatted value of the original column.
 */
export interface GridDataSourcePivotColumnGroupPath {
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
   * Each node in the tree must have a `group` property that is either a string or a part of a row model needed to get the formatted value of the original column.
   * `children` is a list of the next level nodes.
   * Each node at the last level of the tree will be a column group containing each pivot value as a column.
   *
   * Structure:
   * The `group` property can be a string or an object:
   *   - Strings are used directly as column group header names (e.g. `"2025"`, `"January"`)
   *   - Objects contain data that will be formatted into header names using the column's valueFormatter or valueGetter
   *     (e.g. `{date: "2025-01-01"}` could be formatted as `"Jan 2025"`)
   *
   * Examples:
   * - `[{group: "Yes"}, {group: "No"}]` - Creates column groups with values "Yes" and "No"
   * - `[{group: "2025", children: [{group: "January"}, {group: "February"}]}]` - Creates a column group with value "2025"
   *   that has column groups "January" and "February"
   * - `[{group: {date: "2025-01-01"}, children: [{group: {date: "2025-01-01"}}]}, {group: {date: "2025-02-01"}, children: [{group: {date: "2025-02-01"}}]}]` - Creates two levels
   *   of column groups with values returned from the value formatters of the columns used for pivoting.
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
  /**
   * Used to customize the column definition for pivot columns. Useful to target specific pivot value in the rows response.
   * @param {string} field The field of the pivot value.
   * @param {GridDataSourcePivotColumnGroupPath[]} columnGroupPath The path to the column.
   * It is an array of all parent column groups with the original field name and the value passed from the `pivotColumns` response.
   * @param {GridColDef[]} columns All columns definitions from the non-pivoted columns.
   * @returns {Partial<GridColDef>} Partial column definition overrides for the pivot column.
   * The returned part will be merged with the original column definition and certain forced properties for the pivoting column.
   */
  getPivotColumnDef?: (
    field: string,
    columnGroupPath: GridDataSourcePivotColumnGroupPath[],
    columns: Record<string, GridColDef>,
  ) => Partial<GridColDef>;
}

export interface GridDataSourceApiBasePremium extends Omit<GridDataSourceApiBase, 'fetchRows'> {
  /**
   * Fetches the rows from the server.
   * If no `parentId` option is provided, it fetches the root rows.
   * Any missing parameter from `params` will be filled from the state (sorting, filtering, etc.).
   * @param {GridRowId} parentId The id of the parent node (default: `GRID_ROOT_GROUP_ID`).
   * @param {Partial<GridGetRowsParamsPremium>} params Request parameters override.
   */
  fetchRows: (parentId?: GridRowId, params?: Partial<GridGetRowsParamsPremium>) => void;
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
