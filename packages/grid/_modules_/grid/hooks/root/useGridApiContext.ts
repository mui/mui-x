import * as React from 'react';
import { GridApiContext } from '../../components/GridApiContext';

export function useGridApiContext() {
  const apiRef = React.useContext(GridApiContext);

  if (apiRef === undefined) {
    throw new Error(
      [
        'Material-UI X: Could not find the data grid context.',
        'It looks like you rendered your component outside of a DataGrid or XGrid parent component.',
      ].join('\n'),
    );
  }

  return apiRef;
}
