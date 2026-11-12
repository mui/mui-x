import type { GridColDef } from '../colDef/gridColDef';

/**
 * Object passed as parameter of the column order change event.
 */
export interface GridColumnOrderChangeParams {
  /**
   * The column of the current header component.
   */
  column: GridColDef;
  /**
   * The target column index, among all columns, including the hidden ones.
   */
  targetIndex: number;
  /**
   * The old column index, among all columns, including the hidden ones.
   */
  oldIndex: number;
}
