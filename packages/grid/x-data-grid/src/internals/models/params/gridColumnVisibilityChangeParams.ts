import type { GridStateColDef } from '../colDef/gridColDef';

/**
 * Object passed as parameter of the column visibility change event.
 */
export interface GridColumnVisibilityChangeParams {
  /**
   * The field of the column which visibility changed.
   */
  field: string;
  /**
   * The column of the current header component.
   */
  colDef: GridStateColDef;
  /**
   * The visibility state of the column.
   */
  isVisible: boolean;
}
