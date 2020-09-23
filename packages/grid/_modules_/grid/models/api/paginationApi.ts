import { PageChangeParams } from '../params/pageChangeParams';

/**
 * The pagination API interface that is available in the grid [[apiRef]].
 */
export interface PaginationApi {
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
   * Callback fired after a new page has been displayed.
   * @param handler
   */
  onPageChange: (handler: (param: PageChangeParams) => void) => () => void;
  /**
   * Callback fired after the page size was changed.
   * @param handler
   */
  onPageSizeChange: (handler: (param: PageChangeParams) => void) => () => void;
}
