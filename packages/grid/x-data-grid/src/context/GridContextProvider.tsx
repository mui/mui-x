import * as React from 'react';
import { GridApiContext } from '../components/GridApiContext';
import { GridApiCommunity } from '../models/api/gridApiCommunity';
import { GridRootPropsContext } from './GridRootPropsContext';

type GridContextProviderProps = {
  apiRef: React.MutableRefObject<GridApiCommunity>;
  props: {};
  children: React.ReactNode;
};

export const GridContextProvider = ({ apiRef, props, children }: GridContextProviderProps) => {
  return (
    <GridRootPropsContext.Provider value={props}>
      <GridApiContext.Provider value={apiRef}>{children}</GridApiContext.Provider>
    </GridRootPropsContext.Provider>
  );
};
