import * as React from 'react';
import { GridApiContext } from '../../components/GridApiContext';
import { GridApiCommon, GridInternalApiCommon } from '../../models/api/gridApiCommon';
import { GridApiCommunity, GridInternalApiCommunity } from '../../models/api/gridApiCommunity';

export function useGridApiContext<
  Api extends GridApiCommon = GridApiCommunity,
>(): React.MutableRefObject<Api> {
  const { publicApiRef } = React.useContext(GridApiContext);

  if (publicApiRef === undefined) {
    throw new Error(
      [
        'MUI: Could not find the data grid context.',
        'It looks like you rendered your component outside of a DataGrid or DataGridPro parent component.',
        'This can also happen if you are bundling multiple versions of the data grid.',
      ].join('\n'),
    );
  }

  return publicApiRef as React.MutableRefObject<Api>;
}

export function useGridApiInternalContext<
  Api extends GridInternalApiCommon = GridInternalApiCommunity,
>(): React.MutableRefObject<Api> {
  const { internalApiRef } = React.useContext(GridApiContext);

  if (internalApiRef === undefined) {
    throw new Error(
      [
        'MUI: Could not find the data grid context.',
        'It looks like you rendered your component outside of a DataGrid or DataGridPro parent component.',
        'This can also happen if you are bundling multiple versions of the data grid.',
      ].join('\n'),
    );
  }

  return internalApiRef as React.MutableRefObject<Api>;
}
