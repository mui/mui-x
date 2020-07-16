/**
 * Object passed as parameter in the column [[ColDef]] header renderer.
 */
export interface ColParams {
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
