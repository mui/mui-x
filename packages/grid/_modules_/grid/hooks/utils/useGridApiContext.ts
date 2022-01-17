import * as React from 'react';
import { GridApiContext } from '../../components/GridApiContext';
import {GridApiCommunity} from "../../models/api/gridApi";
import {GridApiRef} from "../../models/api/gridApiRef";

export function useGridApiContext<GridApi extends GridApiCommunity = GridApiCommunity>() {
  const apiRef = React.useContext(GridApiContext);

  if (apiRef === undefined) {
    throw new Error(
      [
        'MUI: Could not find the data grid context.',
        'It looks like you rendered your component outside of a DataGrid or DataGridPro parent component.',
        'This can also happen if you are bundling multiple versions of the data grid.',
      ].join('\n'),
    );
  }

  return apiRef as GridApiRef<GridApi>;
}
