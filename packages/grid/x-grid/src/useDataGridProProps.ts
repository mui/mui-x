import * as React from 'react';
import { GridComponentProps } from '../../_modules_/grid/GridComponentProps';
import { useThemeProps } from '../../_modules_/grid/utils/material-ui-utils';
import { DataGridProProps } from './DataGridProProps';

export const useDataGridProProps = (inProps: DataGridProProps): GridComponentProps => {
  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  const classes = React.useMemo(() => {
    if (!inProps.classes) {
      return {};
    }
    return Object.entries(inProps.classes).reduce((acc, [key, value]) => {
      acc[key.replace('__', '--')] = value;
      return acc;
    }, {});
  }, [inProps.classes]);

  return React.useMemo<GridComponentProps>(
    () => ({
      ...themedProps,
      // force props
      signature: 'DataGridPro',
      classes,
    }),
    [themedProps, classes],
  );
};
