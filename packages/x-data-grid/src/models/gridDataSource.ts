import type { GridSortModel, GridFilterModel, GridRowModel, GridPaginationModel } from '.';

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
}

export interface GridGetRowsResponse {
  rows: GridRowModel[];
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
