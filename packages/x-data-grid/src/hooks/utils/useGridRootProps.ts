import * as React from 'react';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export const useGridRootProps = () => {
  const contextValue = React.useContext(GridRootPropsContext);

  if (!contextValue) {
    throw new Error(
      'MUI X: useGridRootProps should only be used inside the DataGrid, DataGridPro or DataGridPremium component.',
    );
  }

  return contextValue as DataGridProcessedProps;
};
