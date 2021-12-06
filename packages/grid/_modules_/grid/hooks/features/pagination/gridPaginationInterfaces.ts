export interface GridPaginationState {
  pageSize: number;
  page: number;
  pageCount: number;
  rowCount: number;
}

/**
 * The apiRef methods handled by `useGridPageSize`
 */
export interface GridPageSizeApi {
  /**
   * Sets the number of displayed rows to the value given by `pageSize`.
   * @param {number} pageSize The new number of displayed rows.
   */
  setPageSize: (pageSize: number) => void;
}

/**
 * The apiRef methods handled by `useGridPage`
 */
export interface GridPageApi {
  /**
   * Sets the displayed page to the value given by `page`.
   * @param {number} page The new page number.
   */
  setPage: (page: number) => void;
}

/**
 * The pagination API interface that is available in the grid [[apiRef]].
 */
export interface GridPaginationApi extends GridPageApi, GridPageSizeApi {}
