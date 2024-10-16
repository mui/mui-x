import type { GridListColDef } from '../colDef/gridColDef';

/**
 * The list view API interface that is available in the grid [[apiRef]].
 */
export interface GridListViewApi {
  /**
   * Returns the [[GridStateColDef]] for the given list column.
   * @param {string} field The column field.
   * @returns {{GridStateColDef}} The [[GridStateColDef]].
   */
  getListColumn: (field: string) => GridListColDef | undefined;
  /**
   * Returns the index position of a list column.
   * @param {string} field The list column field.
   * @returns {number} The index position.
   */
  getListColumnIndex: (field: string) => number;
}
