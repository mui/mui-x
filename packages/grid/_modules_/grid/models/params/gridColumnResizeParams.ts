import type { GridStateColDef } from '../colDef';

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
   * API ref that let you manipulate the grid.
   */
  api: any;
  /**
   * The width of the column.
   */
  width: number;
}
