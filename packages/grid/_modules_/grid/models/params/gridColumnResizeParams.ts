/**
 * Object passed as parameter of the column resize event.
 */
export interface GridColumnResizeParams {
  /**
   * The HTMLElement column header element.
   */
  element?: HTMLElement | null;
  /**
   * The column of the current header component.
   */
  colDef: any;
  /**
   * The width of the column.
   */
  width: number;
}
