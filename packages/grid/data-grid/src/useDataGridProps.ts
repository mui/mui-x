import * as React from 'react';
import { DataGridProps, MAX_PAGE_SIZE } from './DataGridProps';
import {
  GridComponentProps,
  GridInputComponentProps,
} from '../../_modules_/grid/GridComponentProps';
import { useThemeProps } from '../../_modules_/grid/utils/material-ui-utils';
import { useGridProcessedProps } from '../../_modules_/grid/hooks/utils/useGridProcessedProps';

type ForcedPropsKey = Exclude<keyof GridInputComponentProps, keyof DataGridProps> | 'pagination';

const FORCED_PROPS: { [key in ForcedPropsKey]-?: GridInputComponentProps[key] } = {
  apiRef: undefined,
  disableColumnResize: true,
  disableColumnReorder: true,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  throttleRowsMs: undefined,
  hideFooterRowCount: false,
  pagination: true,
  onRowsScrollEnd: undefined,
  checkboxSelectionVisibleOnly: false,
  scrollEndThreshold: undefined,
  signature: 'DataGrid',
};

export const useDataGridProps = (inProps: DataGridProps): GridComponentProps => {
  if (inProps.pageSize! > MAX_PAGE_SIZE) {
    throw new Error(`'props.pageSize' cannot exceed 100 in DataGrid.`);
  }

  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  const props = React.useMemo<GridInputComponentProps>(
    () => ({
      ...themedProps,
      ...FORCED_PROPS,
    }),
    [themedProps],
  );

  return useGridProcessedProps(props);
};
