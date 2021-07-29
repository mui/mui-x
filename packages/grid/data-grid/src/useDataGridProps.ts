import * as React from 'react';
import { DataGridProps, MAX_PAGE_SIZE } from './DataGridProps';
import { GridComponentProps, useThemeProps } from '../../_modules_';

const DATA_GRID_FORCED_PROPS: Omit<
  GridComponentProps,
  Exclude<keyof DataGridProps, 'pagination'>
> = {
  apiRef: undefined,
  disableColumnResize: true,
  disableColumnReorder: true,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  pagination: true,
  onRowsScrollEnd: undefined,
  checkboxSelectionVisibleOnly: false,
};

export const useDataGridProps = (inProps: DataGridProps): GridComponentProps => {
  if (inProps.pageSize! > MAX_PAGE_SIZE) {
    throw new Error(`'props.pageSize' cannot exceed 100 in DataGrid.`);
  }

  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  return React.useMemo<GridComponentProps>(
    () => ({
      ...themedProps,
      ...DATA_GRID_FORCED_PROPS,
    }),
    [themedProps],
  );
};
