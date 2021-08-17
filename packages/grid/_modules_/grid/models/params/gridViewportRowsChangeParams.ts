/**
 * Object passed as parameter of the virtual rows change event.
 */
export interface GridViewportRowsChangeParams {
  /**
   * The index of the first row in the viewport.
   */
  firstRowIndex: number;
  /**
   * The index of the last row in the viewport.
   */
  lastRowIndex: number;
}
