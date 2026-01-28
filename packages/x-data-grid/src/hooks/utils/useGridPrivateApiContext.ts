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
      [
        'MUI X: Could not find the Data Grid private context.',
        'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
        'This can also happen if you are bundling multiple versions of the Data Grid.',
      ].join('\n'),
    );
  }

  return privateApiRef as RefObject<PrivateApi>;
}
