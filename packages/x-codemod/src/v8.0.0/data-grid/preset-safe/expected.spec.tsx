// @ts-nocheck
import * as React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { LicenseInfo } from '@mui/x-license';
import { DataGridPremium, gridRowSelectionIdsSelector } from '@mui/x-data-grid-premium';

/* eslint-disable react-hooks/rules-of-hooks */
const apiRef = useGridApiRef();
const selectedRowIds = gridRowSelectionIdsSelector(apiRef);
const [rowSelectionModel, setRowSelectionModel] = React.useState({
  type: 'include',
  ids: new Set([1, 2, 3]),
});
const [rowSelectionModel1, setRowSelectionModel1] = React.useState([4, 5, 6]);
// prettier-ignore
<React.Fragment>
  <DataGrid
    rowSelectionModel={rowSelectionModel}
    onRowSelectionModelChange={setRowSelectionModel}
    rowSpanning />
  <DataGridPro rowSpanning />
  <DataGridPremium
    experimentalFeatures={{
      warnIfFocusStateIsNotSynced: true,
    }}
    rowSpanning />
  <DataGridPremium rowSpanning />
  <DataGridPremium
    {...props}
  />
</React.Fragment>;
