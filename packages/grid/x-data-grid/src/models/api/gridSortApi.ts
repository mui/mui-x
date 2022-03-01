import { GridColDef } from '../colDef/gridColDef';
import { GridRowId, GridRowModel } from '../gridRows';
import { GridSortDirection, GridSortModel } from '../gridSortModel';

/**
 * The sort API interface that is available in the grid [[apiRef]].
 */
export interface GridSortApi {
  /**
   * Returns the sort model currently applied to the grid.
   * @returns {GridSortModel} The `GridSortModel`.
   */
  getSortModel: () => GridSortModel;
  /**
   * Applies the current sort model to the rows.
   */
  applySorting: () => void;
  /**
   * Updates the sort model and triggers the sorting of rows.
   * @param {GridSortModel} model The `GridSortModel` to be applied.
   */
  setSortModel: (model: GridSortModel) => void;
  /**
   * Sorts a column.
   * @param {GridColDef} column The [[GridColDef]] of the column to be sorted.
   * @param {GridSortDirection} direction The direction to be sorted. By default, the next in the `sortingOrder` prop.
   * @param {boolean} allowMultipleSorting Whether to keep the existing [[GridSortItem]]. Default is `false`.
   */
  sortColumn: (
    column: GridColDef,
    direction?: GridSortDirection,
    allowMultipleSorting?: boolean,
  ) => void;
  /**
   * Returns all rows sorted according to the active sort model.
   * @returns {GridRowModel[]} The sorted [[GridRowModel]] objects.
   */
  getSortedRows: () => GridRowModel[];
  /**
   * Returns all row ids sorted according to the active sort model.
   * @returns {GridRowId[]} The sorted [[GridRowId]] values.
   */
  getSortedRowIds: () => GridRowId[];
  /**
   * Gets the `GridRowId` of a row at a specific index.
   * The index is based on the sorted but unfiltered row list.
   * @param {number} index The index of the row
   * @returns {GridRowId} The `GridRowId` of the row.
   */
  getRowIdFromRowIndex: (index: number) => GridRowId;
  /**
   * Gets the row index of a row with a given id.
   * The index is based on the sorted but unfiltered row list.
   * @param {GridRowId} id The `GridRowId` of the row.
   * @returns {number} The index of the row.
   */
  getRowIndex: (id: GridRowId) => number;
}
