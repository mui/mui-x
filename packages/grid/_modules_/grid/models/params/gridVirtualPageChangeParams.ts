/**
 * Object passed as parameter of the virtual page change event.
 */
export interface GridVirtualPageChangeParams {
  /**
   * The index of the current page.
   */
  currentPage: number;
  /**
   * The index of the next page.
   */
  nextPage: number;
  /**
   * The index of the first row in the current page.
   */
  firstRowIndex: number;
  /**
   * The size of the virtual page.
   */
  pageSize: number;
  /**
   * Api that let you manipulate the grid.
   */
  api: any;
}
