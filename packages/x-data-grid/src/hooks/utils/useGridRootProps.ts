'use client';
import * as React from 'react';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export const useGridRootProps = () => {
  const contextValue = React.useContext(GridRootPropsContext);

  if (!contextValue) {
    throw new Error(
      'MUI X Data Grid: useGridRootProps should only be used inside a Data Grid component. ' +
        'The component must be a child of DataGrid, DataGridPro, or DataGridPremium. ' +
        'Ensure your component is properly nested within a Data Grid.',
    );
  }

  return contextValue as DataGridProcessedProps;
};
