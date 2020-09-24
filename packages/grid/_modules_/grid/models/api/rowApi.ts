import { RowData, RowId, RowModel, Rows } from '../rows';

/**
 * The Row API interface that is available in the grid [[apiRef]].
 */
export interface RowApi {
  /**
   * Get the full set of rows as [[Rows]].
   * @returns [[Rows]]
   */
  getRowModels: () => Rows;
  /**
   * Get the total number of rows in the grid.
   */
  getRowsCount: () => number;
  /**
   * Return the list of row Ids.
   */
  getAllRowIds: () => RowId[];
  /**
   * Set a new set of Rows.
   * @param rows
   */
  setRowModels: (rows: Rows) => void;
  /**
   * Update any properties of the current set of Rows.
   * @param updates
   */
  updateRowModels: (updates: Partial<RowModel>[]) => void;
  /**
   * Update any properties of the current set of RowData[].
   * @param updates
   */
  updateRowData: (updates: RowData[]) => void;
  /**
   * Get the RowId of a row at a specific position.
   * @param index
   */
  getRowIdFromRowIndex: (index: number) => RowId;
  /**
   * Get the row index of a row with a given id.
   * @param id
   */
  getRowIndexFromId: (id: RowId) => number;
  /**
   * Get the [[RowModel]] of a given rowId.
   * @param id
   */
  getRowFromId: (id: RowId) => RowModel;
}
