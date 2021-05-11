import { GridColDef, GridColumns, GridColumnsMeta } from '../colDef/gridColDef';

/**
 * The column API interface that is available in the grid [[apiRef]].
 */
export interface GridColumnApi {
  /**
   * Retrieve a column from its field.
   * @param field
   * @returns [[GridColDef]]
   */
  getColumnFromField: (field: string) => GridColDef;
  /**
   * Get all the [[GridColumns]].
   * @returns An array of [[GridColDef]].
   */
  getAllColumns: () => GridColumns;
  /**
   * Get the currently visible columns.
   * @returns An array of [[GridColDef]].
   */
  getVisibleColumns: () => GridColumns;
  /**
   * Get the columns meta data.
   * @returns [[GridColumnsMeta]]
   */
  getColumnsMeta: () => GridColumnsMeta;
  /**
   * Get the index position of the column in the array of [[GridColDef]].
   * @param field
   */
  getColumnIndex: (field: string, useVisibleColumns?: boolean) => number;
  /**
   * Get the column left position in pixel relative to the left grid inner border.
   * @param field
   */
  getColumnPosition: (field: string) => number;
  /**
   * Allows to update a column [[GridColDef]] model.
   * @param col [[GridColDef]]
   */
  updateColumn: (col: GridColDef) => void;
  /**
   * Allows to batch update multiple columns at the same time.
   * @param cols [[GridColDef[]]]
   * @param resetState
   */
  updateColumns: (cols: GridColDef[], resetColumnState?: boolean) => void;
  /**
   * Allows to toggle a column.
   * @param field
   * @param isVisible
   */
  setColumnVisibility: (field: string, isVisible: boolean) => void;
  /**
   * Allows to move a column to another position in the column array.
   * @param field
   * @param targetIndexPosition
   */
  setColumnIndex: (field: string, targetIndexPosition: number) => void;
  /**
   * Allows to set target column width.
   * @param field
   * @param width
   */
  setColumnWidth: (field: string, width: number) => void;
}
