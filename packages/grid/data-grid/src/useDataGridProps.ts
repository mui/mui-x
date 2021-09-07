import * as React from 'react';
import { DataGridProps, MAX_PAGE_SIZE } from './DataGridProps';
import { GridComponentProps } from '../../_modules_/grid/GridComponentProps';
import { useThemeProps } from '../../_modules_/grid/utils/material-ui-utils';

export const useDataGridProps = (inProps: DataGridProps): GridComponentProps => {
  if (inProps.pageSize! > MAX_PAGE_SIZE) {
    throw new Error(`'props.pageSize' cannot exceed 100 in DataGrid.`);
  }

  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  // TODO force scrollEndThreshold to undefined
  return React.useMemo<GridComponentProps>(
    () => ({
      ...themedProps,
      // force props
      apiRef: undefined,
      disableColumnResize: true,
      disableColumnReorder: true,
      disableMultipleColumnsFiltering: true,
      disableMultipleColumnsSorting: true,
      disableMultipleSelection: true,
      pagination: true,
      onRowsScrollEnd: undefined,
      onViewportRowsChange: undefined,
      checkboxSelectionVisibleOnly: false,
      signature: 'DataGrid',
    }),
    [themedProps],
  );
};
