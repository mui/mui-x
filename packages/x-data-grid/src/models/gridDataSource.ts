import type {
  GridSortModel,
  GridFilterModel,
  GridColDef,
  GridRowModel,
  GridPaginationModel,
} from '.';

// TODO: Remove after moving logic to `Premium` package
type GridAggregationModel = {
  [field: string]: string;
};

export interface GridGetRowsParams {
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
  /**
   * Alternate to `start` and `end`, maps to `GridPaginationModel` interface.
   */
  paginationModel?: GridPaginationModel;
  /**
   * First row index to fetch (number) or cursor information (number | string).
   */
  start: number | string;
  /**
   * Last row index to fetch.
   */
  end: number;
  /**
   * List of grouped columns (only applicable with `rowGrouping`).
   */
  groupFields?: GridColDef['field'][];
  /**
   * Array of keys returned by `getGroupKey` of all the parent rows until the row for which the data is requested
   * `getGroupKey` prop must be implemented to use this.
   * Useful for `treeData` and `rowGrouping` only.
   */
  groupKeys?: string[];
  // TODO: Move the logic to `Premium` package
  aggregationModel?: GridAggregationModel;
  aggregationRowsScope?: 'filtered' | 'all';
}

export interface GridGetRowsResponse {
  rows: GridRowModel[];
  // TODO: Move the logic to `Premium` package
  /**
   * Row to be used for aggregation footer row.
   * It must provide the values for the aggregated columns passed in
   * `GridGetRowsParams.aggregationModel`.
   */
  aggregateRow?: GridRowModel;
  /**
   * To reflect updates in total `rowCount` (optional).
   * Useful when the `rowCount` is inaccurate (for example when filtering) or not available upfront.
   */
  rowCount?: number;
  /**
   * Additional `pageInfo` for advanced use-cases.
   * `hasNextPage`: When row count is unknown/estimated, `hasNextPage` will be used to check if more records are available on server.
   */
  pageInfo?: {
    hasNextPage?: boolean;
    nextCursor?: string;
  };
}

export interface GridDataSource {
  /**
   * This method will be called when the grid needs to fetch some rows.
   * @param {GridGetRowsParams} params The parameters required to fetch the rows.
   * @returns {Promise<GridGetRowsResponse>} A promise that resolves to the data of type [GridGetRowsResponse].
   */
  getRows(params: GridGetRowsParams): Promise<GridGetRowsResponse>;
  /**
   * This method will be called when the user updates a row [Not yet implemented].
   * @param {GridRowModel} updatedRow The updated row.
   * @returns {Promise<any>} If resolved (synced on the backend), the grid will update the row and mutate the cache.
   */
  updateRow?(updatedRow: GridRowModel): Promise<any>;
  /**
   * Used to group rows by their parent group. Replaces `getTreeDataPath` used in client side tree-data.
   * @param {GridRowModel} row The row to get the group key of.
   * @returns {string} The group key for the row.
   */
  getGroupKey?: (row: GridRowModel) => string;
  /**
   * Used to determine the number of children a row has on server.
   * @param {GridRowModel} row The row to check the number of children.
   * @returns {number} The number of children the row has.
   * If the children count is not available for some reason, but there are some children, `getChildrenCount` should return `-1`.
   */
  getChildrenCount?: (row: GridRowModel) => number;
  // TODO: Move the logic to `Premium` package
  /**
   * Used to get the aggregated value for a parent row.
   * @param {GridRowModel} row The row to extract the aggregated value from.
   * @param {GridColDef['field']} field The field to extract the aggregated value for.
   * @returns {string} The aggregated value for a specific aggregated column.
   */
  getAggregatedValue?: (row: GridRowModel, field: GridColDef['field']) => string;
}

export interface GridDataSourceCache {
  /**
   * Set the cache entry for the given key.
   * @param {GridGetRowsParams} key The key of type `GridGetRowsParams`.
   * @param {GridGetRowsResponse} value The value to be stored in the cache.
   */
  set: (key: GridGetRowsParams, value: GridGetRowsResponse) => void;
  /**
   * Get the cache entry for the given key.
   * @param {GridGetRowsParams} key The key of type `GridGetRowsParams`.
   * @returns {GridGetRowsResponse} The value stored in the cache.
   */
  get: (key: GridGetRowsParams) => GridGetRowsResponse | undefined;
  /**
   * Clear the cache.
   */
  clear: () => void;
}
