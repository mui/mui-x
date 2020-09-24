import { RowId, RowModel } from '../rows';
import { RowSelectedParams } from '../params/rowSelectedParams';
import { SelectionChangeParams } from '../params/selectionChangeParams';

/**
 * The selection API interface that is available in the grid [[apiRef]].
 */
export interface SelectionApi {
  /**
   * Toggle the row selected state.
   * @param id
   * @param allowMultiple Default: false = deselect other rows if isSelected is true
   * @param isSelected Default true
   */
  selectRow: (id: RowId, allowMultiple?: boolean, isSelected?: boolean) => void;
  /**
   * Batch toggle rows selected state.
   * @param ids
   * @param isSelected default true
   * @param deselectOtherRows default: false
   */
  selectRows: (ids: RowId[], isSelected?: boolean, deselectOtherRows?: boolean) => void;
  // TODO unify parameter between SelectRow and SelectRows
  /**
   * Get an array of selected rows.
   */
  getSelectedRows: () => RowModel[];
  /**
   * Callback fired after a row is selected.
   * @param handler
   */
  onRowSelected: (handler: (param: RowSelectedParams) => void) => () => void;
  /**
   * Callback fired after one or multiple rows had a selection state change.
   * @param handler
   */
  onSelectionChange: (handler: (param: SelectionChangeParams) => void) => () => void;
}
