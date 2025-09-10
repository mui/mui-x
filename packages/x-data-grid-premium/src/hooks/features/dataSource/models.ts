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

export interface GridGetRowsResponsePremium extends GridGetRowsResponse {
  /**
   * Row to be used for aggregation footer row.
   * It must provide the values for the aggregated columns passed in
   * `GridGetRowsParams.aggregationModel`.
   */
  aggregateRow?: GridValidRowModel;
  /**
   * Defines the structure of pivot columns to be created from the pivoted data.
   * Each array item represents a column path that defines how pivot columns should be generated.
   *
   * Structure:
   * - Each path is an array where elements represent the hierarchy from column group to value field
   * - Elements before the last one can be strings or objects:
   *   - Strings are used directly as column group header names (e.g. "2025", "January")
   *   - Objects contain data that will be formatted into header names using the column's valueFormatter
   *     (e.g. {date: "2025-01-01"} could be formatted as "Jan 2025")
   * - The last element must always be a string representing the field name of the pivot value
   *
   * Examples:
   * - `[["Yes", "quantity"], ["Yes", "price"], ["No", "quantity"], ["No", "price"]]` - Creates column groups with values "Yes" and "No",
   * each having a "quantity" and "price" column
   * - `[["2025", "January", "price"], ["2025", "February", "price"]]` - Creates a column group with value "2025"
   * that has column groups "January" and "February", each having a "price" column
   * - `[[{date: "2025-01-01"}, {date: "2025-01-01"}, "price"], [{date: "2025-02-01"}, {date: "2025-02-01"}, "price"]]` - Creates two levels
   * of column groups with values returned from the value formatters of the columns used for pivoting. Each group will have a "price" column.
   * The grid uses these paths to build the column grouping model.
   */
  pivotColumns?: (string | GridRowModel)[][];
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
   * @param {(string | GridRowModel)[]} columnPath The path to the pivot column (item from the `pivotColumns` response).
   * @param {GridColDef[]} columns All columns definitions from the non-pivoted columns.
   * @returns {Partial<GridColDef>} Partial column definition overrides for the pivot column.
   * The returned part will be merged with the original column definition and certain forced properties for the pivoting column.
   */
  getPivotColumnDef?: (
    columnPath: (string | GridRowModel)[],
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
