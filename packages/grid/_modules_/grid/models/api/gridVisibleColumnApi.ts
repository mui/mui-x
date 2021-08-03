import { GridStateColDef } from '../colDef/gridColDef';

/**
 * The column API interface that is available in the grid [[apiRef]].
 */
export interface GridVisibleColumnApi {
  /**
   * Returns the currently visible columns.
   * @returns {GridStateColDef[]} An array of [[GridStateColDef]].
   */
  getVisibleColumns: () => GridStateColDef[];
  /**
   * Changes the visibility of the column referred by `field`.
   * @param {string} field The column to change visibility.
   * @param {boolean} isVisible Pass `true` to show the column, or `false` to hide it.
   */
  setColumnVisibility: (field: string, isVisible: boolean) => void;
}
