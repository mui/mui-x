import * as React from 'react';
import { GridApiContext } from '../components/GridApiContext';
import { GridRootPropsContext } from './GridRootPropsContext';

export const GridContextProvider = ({ publicApiRef, internalApiRef, props, children }) => {
  const apiContextValue = React.useMemo(
    () => ({ publicApiRef, internalApiRef }),
    [publicApiRef, internalApiRef],
  );

  return (
    <GridRootPropsContext.Provider value={props}>
      <GridApiContext.Provider value={apiContextValue}>{children}</GridApiContext.Provider>
    </GridRootPropsContext.Provider>
  );
};
