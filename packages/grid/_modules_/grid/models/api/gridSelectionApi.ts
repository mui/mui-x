import { GridRowId, GridRowModel } from '../gridRows';

/**
 * The selection API interface that is available in the grid [[apiRef]].
 */
export interface GridSelectionApi {
  /**
   * Toggle the row selected state.
   * @param id
   * @param isSelected Default true
   * @param allowMultiple Default: false = deselect other rows if isSelected is true
   */
  selectRow: (id: GridRowId, isSelected?: boolean, allowMultiple?: boolean) => void;
  /**
   * Batch toggle rows selected state.
   * @param ids
   * @param isSelected default true
   * @param deselectOtherRows default: false
   */
  selectRows: (ids: GridRowId[], isSelected?: boolean, deselectOtherRows?: boolean) => void;
  // TODO unify parameter between SelectRow and SelectRows
  /**
   * Get an array of selected rows.
   */
  getSelectedRows: () => Map<GridRowId, GridRowModel>;
  /**
   * Reset the selected rows to the array of ids passed in parameter
   * @param GridRowId[]
   */
  setSelectionModel: (rowIds: GridRowId[]) => void;
}
