import * as React from 'react';
import { GridComponentProps } from '../../_modules_/grid/GridComponentProps';
import { useThemeProps } from '../../_modules_/grid/utils/material-ui-utils';
import { XGridProps } from './XGridProps';

const X_GRID_FORCED_PROPS: Omit<GridComponentProps, keyof XGridProps> = {
  signature: 'XGrid',
};

export const useXGridProps = (inProps: XGridProps): GridComponentProps => {
  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  return React.useMemo<GridComponentProps>(
    () => ({
      ...themedProps,
      ...X_GRID_FORCED_PROPS,
    }),
    [themedProps],
  );
};
