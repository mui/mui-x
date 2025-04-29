import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridApiContext } from '../components/GridApiContext';
import { GridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { GridPrivateApiCommunity } from '../models/api/gridApiCommunity';
import { GridRootPropsContext } from './GridRootPropsContext';
import { GridConfiguration } from '../models/configuration/gridConfiguration';
import { GridConfigurationContext } from '../components/GridConfigurationContext';
import { GridPanelContextProvider } from '../components/panel/GridPanelContext';
import { GridCSSVariablesContext } from '../utils/css/context';

type GridContextProviderProps = {
  privateApiRef: RefObject<GridPrivateApiCommunity>;
  configuration: GridConfiguration;
  props: {};
  children: React.ReactNode;
};

export function GridContextProvider({
  privateApiRef,
  configuration,
  props,
  children,
}: GridContextProviderProps) {
  const apiRef = React.useRef(privateApiRef.current.getPublicApi());

  return (
    <GridConfigurationContext.Provider value={configuration}>
      <GridRootPropsContext.Provider value={props}>
        <GridPrivateApiContext.Provider value={privateApiRef}>
          <GridApiContext.Provider value={apiRef}>
            <GridPanelContextProvider>
              <GridCSSVariablesContext>{children}</GridCSSVariablesContext>
            </GridPanelContextProvider>
          </GridApiContext.Provider>
        </GridPrivateApiContext.Provider>
      </GridRootPropsContext.Provider>
    </GridConfigurationContext.Provider>
  );
}
