import * as React from 'react';
import { GridComponentProps } from '../../GridComponentProps';

export const GridRootPropsContext = React.createContext<GridComponentProps | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridRootPropsContext.displayName = 'GridRootPropsContext';
}

export const useGridRootProps = () => {
  const contextValue = React.useContext(GridRootPropsContext);

  if (!contextValue) {
    throw new Error(
      'Material-UI: useGridRootProps should only be used inside the DataGrid/DataGridPro component.',
    );
  }

  return contextValue;
};
