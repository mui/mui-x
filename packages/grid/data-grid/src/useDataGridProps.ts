import * as React from 'react';
import { DataGridProps, MAX_PAGE_SIZE } from './DataGridProps';
import {
  GridComponentProps,
  GridInputComponentProps,
} from '../../_modules_/grid/GridComponentProps';
import { useThemeProps } from '../../_modules_/grid/utils/material-ui-utils';
import { useProcessedProps } from '../../_modules_/grid/hooks/utils/useProcessedProps';

export const useDataGridProps = (inProps: DataGridProps): GridComponentProps => {
  if (inProps.pageSize! > MAX_PAGE_SIZE) {
    throw new Error(`'props.pageSize' cannot exceed 100 in DataGrid.`);
  }

  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  const props = React.useMemo<GridInputComponentProps>(
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
        scrollEndThreshold: undefined,
      signature: 'DataGrid',
    }),
    [themedProps],
  );

  return useProcessedProps(props);
};
