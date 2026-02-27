'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { GridApiContext } from '../../components/GridApiContext';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import type { GridApiCommunity } from '../../models/api/gridApiCommunity';

export function useGridApiContext<Api extends GridApiCommon = GridApiCommunity>(): RefObject<Api> {
  const apiRef = React.useContext(GridApiContext);

  if (apiRef === undefined) {
    throw new Error(
      'MUI X Data Grid: Could not find the Data Grid context. ' +
        'This happens when a component is rendered outside of a DataGrid, DataGridPro, or DataGridPremium parent component. ' +
        'Ensure your component is a child of a Data Grid component. ' +
        'This can also happen if you are bundling multiple versions of the Data Grid.',
    );
  }

  return apiRef as RefObject<Api>;
}
