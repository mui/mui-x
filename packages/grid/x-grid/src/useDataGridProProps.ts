import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  GridComponentProps,
  GridInputComponentProps,
} from '../../_modules_/grid/GridComponentProps';
import { DataGridProProps } from './DataGridProProps';
import { useGridProcessedProps } from '../../_modules_/grid/hooks/utils/useGridProcessedProps';

export const useDataGridProProps = (inProps: DataGridProProps): GridComponentProps => {
  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  const props = React.useMemo<GridInputComponentProps>(
    () => ({
      ...themedProps,
      // force props
      signature: 'DataGridPro',
    }),
    [themedProps],
  );

  return useGridProcessedProps(props);
};
