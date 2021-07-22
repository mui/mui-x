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
  colDef: import('../colDef/gridColDef').GridColDef;
  /**
   * API ref that let you manipulate the grid.
   */
  api: import('../api/gridApiRef').GridApiRef;
  /**
   * The width of the column.
   */
  width: number;
}
