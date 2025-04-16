import type { GridStateColDef } from '../colDef/gridColDef';

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
  colDef: GridStateColDef;
  /**
   * The width of the column.
   */
  width: number;
}
