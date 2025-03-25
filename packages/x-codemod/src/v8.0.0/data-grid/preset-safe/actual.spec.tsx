// @ts-nocheck
import * as React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { DataGridPro, LicenseInfo } from '@mui/x-data-grid-pro';
import { DataGridPremium, selectedGridRowsSelector } from '@mui/x-data-grid-premium';

/* eslint-disable react-hooks/rules-of-hooks */
const apiRef = useGridApiRef();
const selectedRowIds = selectedGridRowsSelector(apiRef);
const [rowSelectionModel, setRowSelectionModel] = React.useState([1, 2, 3]);
const [rowSelectionModel1, setRowSelectionModel1] = React.useState([4, 5, 6]);
// prettier-ignore
<React.Fragment>
  <DataGrid
    rowSelectionModel={rowSelectionModel}
    onRowSelectionModelChange={setRowSelectionModel}
    indeterminateCheckboxAction="deselect"
    rowPositionsDebounceMs={100}
    unstable_rowSpanning
  />
  <DataGridPro
    indeterminateCheckboxAction="deselect"
    rowPositionsDebounceMs={100}
    unstable_rowSpanning
  />
  <DataGridPremium
    experimentalFeatures={{
      warnIfFocusStateIsNotSynced: true,
      ariaV8: true,
    }}
    indeterminateCheckboxAction="deselect"
    rowPositionsDebounceMs={100}
    unstable_rowSpanning
  />
  <DataGridPremium
    experimentalFeatures={{
      ariaV8: true,
    }}
    unstable_rowSpanning
  />
  <DataGridPremium
    {...props}
  />
</React.Fragment>;
