import { ColDef, Columns, ColumnsMeta } from '../colDef/colDef';

/**
 * The column api interface that is available in the grid [[apiRef]]
 */
export interface ColumnApi {
  /**
   * Retrieve a column from its field
   * @return [[ColDef]]
   * @param field
   */
  getColumnFromField: (field: string) => ColDef;
  /**
   * Get all the [[Columns]]
   * @return an array of [[ColDef]]
   */
  getAllColumns: () => Columns;
  /**
   * Get the currently visible columns
   * @returns an array of [[ColDef]]
   */
  getVisibleColumns: () => Columns;
  /**
   * Get the columns meta data
   * @return [[ColumnsMeta]]
   */
  getColumnsMeta: () => ColumnsMeta;
  /**
   * Get the index position of the column in the array of [[ColDef]]
   * @param field
   */
  getColumnIndex: (field: string) => number;
  /**
   * Get the column left position in pixel relative to the left grid inner border
   * @param field
   */
  getColumnPosition: (field: string) => number;
  /**
   * Allows to update a column [[ColDef]] model
   * @param col [[ColDef]]
   */
  updateColumn: (col: ColDef) => void;
  /**
   * Allows to batch update multiple columns at the same time
   * @param cols [[ColDef[]]]
   */
  updateColumns: (cols: ColDef[]) => void;
}
