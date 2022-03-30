import * as React from 'react';
import { GridInternalApiContext } from '../../context/GridInternalApiContext';
import { GridInternalApiCommon } from '../../models/api/gridApiCommon';
import { GridInternalApiCommunity } from '../../models/api/gridApiCommunity';

export function useGridInternalApiContext<
  Api extends GridInternalApiCommon = GridInternalApiCommunity,
>(): React.MutableRefObject<Api> {
  const internalApiRef = React.useContext(GridInternalApiContext);

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
