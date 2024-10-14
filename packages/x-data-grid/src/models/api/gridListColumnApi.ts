import { GridStateColDef } from '../colDef/gridColDef';

/**
 * The list column API interface that is available in the grid [[apiRef]].
 */
export interface GridListColumnApi {
  /**
   * Returns the [[GridStateColDef]] for the given list column.
   * @param {string} field The column field.
   * @returns {{GridStateColDef}} The [[GridStateColDef]].
   */
  getListColumn: (field: string) => GridStateColDef | undefined;
  /**
   * Returns the index position of a list column.
   * @param {string} field The list column field.
   * @returns {number} The index position.
   */
  getListColumnIndex: (field: string) => number;
}
