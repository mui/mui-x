import { RowId, RowModel } from '../rows';
import { RowSelectedParams } from '../params/rowSelectedParams';
import { SelectionChangedParams } from '../params/selectionChangedParams';

export interface SelectionApi {
  selectRow: (id: RowId, allowMultiple?: boolean, isSelected?: boolean) => void;
  selectRows: (ids: RowId[], isSelected?: boolean, deselectOtherRows?: boolean) => void;
  getSelectedRows: () => RowModel[];
  onSelectedRow: (handler: (param: RowSelectedParams) => void) => () => void;
  onSelectionChanged: (handler: (param: SelectionChangedParams) => void) => () => void;
}
