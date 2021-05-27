/**
 * The pagination API interface that is available in the grid [[apiRef]].
 */
export interface GridPaginationApi {
  /**
   * Sets the displayed page to the value given by `page`.
   * @param {number} page The new page number
   */
  setPage: (page: number) => void;
  /**
   * Sets the number of displayed rows to the value given by `pageSize`.
   * @param {number} pageSize The new number of displayed rows.
   */
  setPageSize: (pageSize: number) => void;
}
