import * as React from 'react';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { DataGridProProcessedProps } from '../../models/props/DataGridProProps';

export const useGridRootProps = <
  Props extends DataGridProcessedProps | DataGridProProcessedProps,
>() => {
  const contextValue = React.useContext(GridRootPropsContext);

  if (!contextValue) {
    throw new Error(
      'MUI: useGridRootProps should only be used inside the DataGrid/DataGridPro component.',
    );
  }

  return contextValue as Props;
};
