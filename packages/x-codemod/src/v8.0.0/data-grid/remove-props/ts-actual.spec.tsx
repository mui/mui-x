// @ts-nocheck
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

// prettier-ignore
function App() {
  return (
    <React.Fragment>
      <DataGrid
        indeterminateCheckboxAction="deselect"
        rowPositionsDebounceMs={100}
        resetPageOnSortFilter
      />
      <DataGridPro
        indeterminateCheckboxAction="select"
        rowPositionsDebounceMs={100}
        resetPageOnSortFilter
      />
      <DataGridPremium
        indeterminateCheckboxAction="deselect"
        rowPositionsDebounceMs={100}
        resetPageOnSortFilter
      />
    </React.Fragment>
  );
}

export default App;
