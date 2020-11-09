import { ColDef, Columns, ColumnsMeta } from '../colDef/colDef';

/**
 * The column API interface that is available in the grid [[apiRef]].
 */
export interface ColumnApi {
  /**
   * Retrieve a column from its field.
   * @param field
   * @returns [[ColDef]]
   */
  getColumnFromField: (field: string) => ColDef;
  /**
   * Get all the [[Columns]].
   * @returns An array of [[ColDef]].
   */
  getAllColumns: () => Columns;
  /**
   * Get the currently visible columns.
   * @returns An array of [[ColDef]].
   */
  getVisibleColumns: () => Columns;
  /**
   * Get the columns meta data.
   * @returns [[ColumnsMeta]]
   */
  getColumnsMeta: () => ColumnsMeta;
  /**
   * Get the index position of the column in the array of [[ColDef]].
   * @param field
   */
  getColumnIndex: (field: string, useVisibleColumns?: boolean) => number;
  /**
   * Get the column left position in pixel relative to the left grid inner border.
   * @param field
   */
  getColumnPosition: (field: string) => number;
  /**
   * Allows to update a column [[ColDef]] model.
   * @param col [[ColDef]]
   */
  updateColumn: (col: ColDef) => void;
  /**
   * Allows to batch update multiple columns at the same time.
   * @param cols [[ColDef[]]]
   * @param resetState
   */
  updateColumns: (cols: ColDef[], resetColumnState?: boolean) => void;
}
