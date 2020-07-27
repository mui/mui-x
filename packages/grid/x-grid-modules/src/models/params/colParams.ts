/**
 * Object passed as parameter in the column [[ColDef]] header renderer.
 */
export interface ColParams {
  /**
   * The column field of the column that triggered the event
   */
  field: string;
  /**
   * The column of the current header component
   */
  colDef: any;
  /**
   * The column index of the current header component
   */
  colIndex: number;
  /**
   * ApiRef that let you manipulate the grid
   */
  api: any;
}
