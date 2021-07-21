import { GridBaseComponentProps } from '../../_modules_/grid/GridBaseComponentProps';
import { GridRowId } from '../../_modules_/grid/models/gridRows';

export const MAX_PAGE_SIZE = 100;

/**
 * The grid component react props interface.
 */
export interface DataGridProps extends GridBaseComponentProps {
  apiRef: undefined;
  disableColumnResize: true;
  disableColumnReorder: true;
  disableMultipleColumnsFiltering: true;
  disableMultipleColumnsSorting: true;
  disableMultipleSelection: true;
  pagination: true;
  onRowsScrollEnd: undefined;
  checkboxSelectionVisibleOnly: false;
  selectionModel?: GridRowId | GridRowId[];

}
