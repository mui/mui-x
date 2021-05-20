/**
 * Object passed as parameter of the virtual page change event.
 */
export interface GridVirtualPageChangeParams {
  /**
   * The current page.
   */
  currentPage: number;
  /**
   * The next page.
   */
  nextPage: number;
  /**
   * Api that let you manipulate the grid.
   */
  api: any;
}
