/**
 * The pagination API interface that is available in the grid [[apiRef]].
 */
export interface GridPaginationApi {
  /**
   * Set the displayed page.
   * @param page
   */
  setPage: (page: number) => void;
  /**
   * Set the number of rows in one page.
   * @param pageSize
   */
  setPageSize: (pageSize: number) => void;
}
