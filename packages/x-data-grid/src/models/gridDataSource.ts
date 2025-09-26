import type {
  GridSortModel,
  GridFilterModel,
  GridRowModel,
  GridPaginationModel,
  GridRowId,
} from '.';

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

export interface GridUpdateRowParams {
  rowId: GridRowId;
  updatedRow: GridRowModel;
  previousRow: GridRowModel;
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
    nextCursor?: any;
  };
}

export interface GridDataSource {
  /**
   * This method will be called when the grid needs to fetch some rows.
   * @param {GridGetRowsParams} params The parameters required to fetch the rows.
   * @returns {Promise<GridGetRowsResponse>} A promise that resolves to the data of type [GridGetRowsResponse].
   */
  getRows(
    params: GridGetRowsParams & {
      /**
       * For cursor pagination only.
       * To get the cursor to be used in the next request.
       * @returns {Promise<any>} A promise that resolves the cursor.
       */
      getCursor: () => Promise<any>;
    },
  ): Promise<GridGetRowsResponse>;
  /**
   * This method will be called when the user updates a row.
   * @param {GridUpdateRowParams} params The parameters required to update the row.
   * @returns {Promise<any>} If resolved (synced on the backend), the grid will update the row and mutate the cache.
   */
  updateRow?(params: GridUpdateRowParams): Promise<any>;
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

export interface GridDataSourceCursorCache extends GridDataSourceCache {
  /**
   * Push a key to the cache key list as soon as it is requested without waiting for the response.
   * @param {GridGetRowsParams} key The key of type `GridGetRowsParams`.
   */
  pushKey: (key: GridGetRowsParams) => void;
  /**
   * Resolve the last cache entry.
   * @param {GridGetRowsParams} key The key of type `GridGetRowsParams`.
   * @returns {GridGetRowsResponse} The earlier value of the specified key stored in the cache.
   */
  getLast: (key: GridGetRowsParams) => Promise<GridGetRowsResponse | undefined>;
}
