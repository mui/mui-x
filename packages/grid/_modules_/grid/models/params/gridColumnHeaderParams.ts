/**
 * Object passed as parameter in the column [[GridColDef]] header renderer.
 */
export interface GridColumnHeaderParams {
  /**
   * The column field of the column that triggered the event
   */
  field: string;
  /**
   * The column of the current header component.
   */
  colDef: import('../colDef/gridColDef').GridColDef;
  /**
   * API ref that let you manipulate the grid.
   */
  api: import('../api/gridApi').GridApi;
}
