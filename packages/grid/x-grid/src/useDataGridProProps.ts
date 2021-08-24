import * as React from 'react';
import { GridComponentProps } from '../../_modules_/grid/GridComponentProps';
import { useThemeProps } from '../../_modules_/grid/utils/material-ui-utils';
import { DataGridProProps } from './DataGridProProps';

export const useDataGridProProps = (inProps: DataGridProProps): GridComponentProps => {
  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  return React.useMemo<GridComponentProps>(
    () => ({
      ...themedProps,
      // force props
      signature: 'DataGridPro',
    }),
    [themedProps],
  );
};
