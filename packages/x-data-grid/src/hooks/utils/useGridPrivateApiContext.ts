'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridPrivateApiCommunity } from '../../models/api/gridApiCommunity';

export const GridPrivateApiContext = React.createContext<unknown>(undefined);

export function useGridPrivateApiContext<
  PrivateApi extends GridPrivateApiCommon = GridPrivateApiCommunity,
>(): RefObject<PrivateApi> {
  const privateApiRef = React.useContext(GridPrivateApiContext);

  if (privateApiRef === undefined) {
    throw new Error(
      'MUI X Data Grid: Could not find the Data Grid private context. ' +
        'This happens when a component is rendered outside of a DataGrid, DataGridPro, or DataGridPremium parent component. ' +
        'Ensure your component is a child of a Data Grid component. ' +
        'This can also happen if you are bundling multiple versions of the Data Grid.',
    );
  }

  return privateApiRef as RefObject<PrivateApi>;
}
