import * as React from 'react';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { DATA_GRID_DEFAULT_SLOT_PROPS } from '../../constants/defaultGridSlotProps';

export const useGridRootProps = () => {
  const contextValue = React.useContext(GridRootPropsContext);

  if (!contextValue) {
    throw new Error(
      'MUI: useGridRootProps should only be used inside the DataGrid, DataGridPro or DataGridPremium component.',
    );
  }

  return contextValue as DataGridProcessedProps & {
    slotDefaultProps: typeof DATA_GRID_DEFAULT_SLOT_PROPS;
  };
};
