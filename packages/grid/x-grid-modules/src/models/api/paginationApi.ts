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
   * Handler that is triggered after a new page has been displayed
   * @param handler
   */
  onPageChange: (handler: (param: PageChangeParams) => void) => () => void;
  /**
   * Handler that is triggered after the page size was change
   * @param handler
   */
  onPageSizeChange: (handler: (param: PageChangeParams) => void) => () => void;
}
