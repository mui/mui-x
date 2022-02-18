import type { GridStateColDef } from '../colDef/gridColDef';

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
  colDef: GridStateColDef;
}
