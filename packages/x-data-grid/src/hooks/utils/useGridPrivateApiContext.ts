import * as React from 'react';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { GridPrivateApiCommunity } from '../../models/api/gridApiCommunity';

export const GridPrivateApiContext = React.createContext<unknown>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridPrivateApiContext.displayName = 'GridPrivateApiContext';
}

export function useGridPrivateApiContext<
  PrivateApi extends GridPrivateApiCommon = GridPrivateApiCommunity,
>(): React.MutableRefObject<PrivateApi> {
  const privateApiRef = React.useContext(GridPrivateApiContext);

  if (privateApiRef === undefined) {
    throw new Error(
      [
        'MUI X: Could not find the data grid private context.',
        'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
        'This can also happen if you are bundling multiple versions of the data grid.',
      ].join('\n'),
    );
  }

  return privateApiRef as React.MutableRefObject<PrivateApi>;
}
