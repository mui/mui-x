import * as React from 'react';
import { GridApiContext } from '../components/GridApiContext';
import { GridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { GridPrivateApiCommunity } from '../models/api/gridApiCommunity';
import { GridRootPropsContext } from './GridRootPropsContext';

type GridContextProviderProps = {
  privateApiRef: React.MutableRefObject<GridPrivateApiCommunity>;
  props: {};
  children: React.ReactNode;
};

export function GridContextProvider({ privateApiRef, props, children }: GridContextProviderProps) {
  const apiRef = React.useRef(privateApiRef.current.getPublicApi());

  return (
    <GridRootPropsContext.Provider value={props}>
      <GridPrivateApiContext.Provider value={privateApiRef}>
        <GridApiContext.Provider value={apiRef}>{children}</GridApiContext.Provider>
      </GridPrivateApiContext.Provider>
    </GridRootPropsContext.Provider>
  );
}
