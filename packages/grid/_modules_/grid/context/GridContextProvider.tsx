import * as React from 'react';
import { GridApiContext } from '../components/GridApiContext';
import { GridRootPropsContext } from './GridRootPropsContext';

export const GridContextProvider = ({ apiRef, props, children }) => {
  return (
    <GridRootPropsContext.Provider value={props}>
      <GridApiContext.Provider value={apiRef}>{children}</GridApiContext.Provider>
    </GridRootPropsContext.Provider>
  );
};
