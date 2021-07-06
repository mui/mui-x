/**
 * Object passed as parameter of the virtual page change event.
 */
export interface GridViewportRowChange {
  /**
   * The index of the first row in the viewport.
   */
  firstRowIndex: number;
  /**
   * The index of the last row in the viewport.
   */
  lastRowIndex: number;
  /**
   * Api that let you manipulate the grid.
   */
  api: any;
}
