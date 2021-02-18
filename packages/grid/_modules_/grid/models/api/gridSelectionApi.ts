import { GridRowId, GridRowModel } from '../gridRows';
import { GridRowSelectedParams } from '../params/gridRowSelectedParams';
import { GridSelectionModelChangeParams } from '../params/gridSelectionModelChangeParams';

/**
 * The selection API interface that is available in the grid [[apiRef]].
 */
export interface GridSelectionApi {
  /**
   * Toggle the row selected state.
   * @param id
   * @param allowMultiple Default: false = deselect other rows if isSelected is true
   * @param isSelected Default true
   */
  selectRow: (id: GridRowId, allowMultiple?: boolean, isSelected?: boolean) => void;
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
  getSelectedRows: () => GridRowModel[];
  /**
   * Callback fired after a row is selected.
   * @param handler
   */
  onRowSelected: (handler: (param: GridRowSelectedParams) => void) => () => void;
  /**
   * Callback fired after one or multiple rows had a selection state change.
   * @param handler
   */
  onSelectionModelChange: (handler: (param: GridSelectionModelChangeParams) => void) => () => void;
  /**
   * Reset the selected rows to the array of ids passed in parameter
   * @param GridRowId[]
   */
  setSelectionModel: (rowIds: GridRowId[]) => void;
}
