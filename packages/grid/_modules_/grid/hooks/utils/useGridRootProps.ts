import * as React from 'react';

import { GridRootPropsContext } from '../../context/GridRootPropsContext';

export const useGridRootProps = () => {
  const contextValue = React.useContext(GridRootPropsContext);

  if (!contextValue) {
    throw new Error(
      'Material-UI: useGridRootProps should only be used inside the DataGrid / XGrid component',
    );
  }

  return contextValue;
};
