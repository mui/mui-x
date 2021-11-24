import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DataGridProps, MAX_PAGE_SIZE } from './DataGridProps';
import {
  GridComponentProps,
  GridInputComponentProps,
} from '../../_modules_/grid/GridComponentProps';
import { useGridProcessedProps } from '../../_modules_/grid/hooks/utils/useGridProcessedProps';

type ForcedPropsKey = Exclude<keyof GridInputComponentProps, keyof DataGridProps> | 'pagination';

const FORCED_PROPS: { [key in ForcedPropsKey]-?: GridInputComponentProps[key] } = {
  apiRef: undefined,
  disableColumnResize: true,
  disableColumnReorder: true,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  disableChildrenFiltering: undefined,
  disableChildrenSorting: undefined,
  getTreeDataPath: undefined,
  groupingColDef: undefined,
  throttleRowsMs: undefined,
  hideFooterRowCount: false,
  pagination: true,
  onRowsScrollEnd: undefined,
  checkboxSelectionVisibleOnly: false,
  scrollEndThreshold: undefined,
  defaultGroupingExpansionDepth: undefined,
  treeData: undefined,
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
