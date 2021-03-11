/**
 * Object passed as parameter in the column [[GridColDef]] header renderer.
 */
export interface GridColParams {
  /**
   * The HTMLElement column header element.
   */
  element?: HTMLElement | null;
  /**
   * The column field of the column that triggered the event
   */
  field: string;
  /**
   * The column of the current header component.
   */
  colDef: any;
  /**
   * The column index of the current header component.
   */
  colIndex: number;
  /**
   * API ref that let you manipulate the grid.
   */
  api: any;
}
