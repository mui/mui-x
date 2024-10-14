import * as React from 'react';
import { GridApiContext } from '../../components/GridApiContext';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';

export function useGridApiContext<
  Api extends GridApiCommon = GridApiCommunity,
>(): React.MutableRefObject<Api> {
  const apiRef = React.useContext(GridApiContext);

  if (apiRef === undefined) {
    throw new Error(
      [
        'MUI X: Could not find the Data Grid context.',
        'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
        'This can also happen if you are bundling multiple versions of the Data Grid.',
      ].join('\n'),
    );
  }

  return apiRef as React.MutableRefObject<Api>;
}
