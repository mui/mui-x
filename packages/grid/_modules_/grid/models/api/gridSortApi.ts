import { GridColDef } from '../colDef/gridColDef';
import { GridRowId, GridRowModel } from '../gridRows';
import { GridSortDirection, GridSortModel } from '../gridSortModel';

/**
 * The sort API interface that is available in the grid [[apiRef]].
 */
export interface GridSortApi {
  /**
   * Get the sort model currently applied to the grid.
   */
  getSortModel: () => GridSortModel;
  /**
   * Apply the current sorting model to the rows.
   */
  applySorting: () => void;
  /**
   * Set the sort model and trigger the sorting of rows.
   * @param model
   */
  setSortModel: (model: GridSortModel) => void;
  /**
   * Set the sort direction of a column.
   * @param column
   * @param direction
   * @param allowMultipleSorting
   */
  sortColumn: (
    column: GridColDef,
    direction?: GridSortDirection,
    allowMultipleSorting?: boolean,
  ) => void;
  /**
   * Get the full set of sorted rows as [[GridRowModel]].
   * @returns [[GridRowModel]]
   */
  getSortedRows: () => GridRowModel[];
  /**
   * Get the full set of sorted row ids as [[GridRowId]].
   * @returns [[GridRowId]]
   */
  getSortedRowIds: () => GridRowId[];
}
