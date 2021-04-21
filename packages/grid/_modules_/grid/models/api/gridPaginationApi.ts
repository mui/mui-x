import { GridPageChangeParams } from '../params/gridPageChangeParams';

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
  /**
   * Callback fired after the page size was changed.
   * @param handler
   */
  onPageSizeChange: (handler: (param: GridPageChangeParams) => void) => () => void;
}
