import { GridBaseComponentProps } from '../../_modules_/grid/GridBaseComponentProps';

export const MAX_PAGE_SIZE = 100;

/**
 * The grid component react props interface.
 */
export type DataGridProps = Omit<
  GridBaseComponentProps,
  | 'apiRef'
  | 'checkboxSelectionVisibleOnly'
  | 'disableColumnResize'
  | 'disableColumnReorder'
  | 'disableMultipleColumnsFiltering'
  | 'disableMultipleColumnsSorting'
  | 'disableMultipleSelection'
  | 'licenseStatus'
  | 'options'
  | 'onRowsScrollEnd'
  | 'pagination'
  | 'scrollEndThreshold'
  | 'selectionModel'
> & {
  apiRef?: undefined;
  checkboxSelectionVisibleOnly?: false;
  disableColumnResize?: true;
  disableColumnReorder?: true;
  disableMultipleColumnsFiltering?: true;
  disableMultipleColumnsSorting?: true;
  disableMultipleSelection?: true;
  onRowsScrollEnd?: undefined;
  pagination?: true;
};
