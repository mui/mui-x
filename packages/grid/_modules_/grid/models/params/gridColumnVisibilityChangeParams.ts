/**
 * Object passed as parameter of the column visibility change event.
 */
export interface GridColumnVisibilityChangeParams {
  /**
   * The column of the current header component.
   */
  colDef: any;
  /**
   * API ref that let you manipulate the grid.
   */
  api: any;
  /**
   * The visibility state of the column.
   */
  isVisible: boolean;
}
