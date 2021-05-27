import * as React from 'react';
import { GridApiContext } from '../components/GridApiContext';
import { GridPropsContext } from './GridPropsContext';

export const GridContextProvider = ({ apiRef, props, children }) => {
  return (
    <GridPropsContext.Provider value={props}>
      <GridApiContext.Provider value={apiRef}>{children}</GridApiContext.Provider>
    </GridPropsContext.Provider>
  );
};
