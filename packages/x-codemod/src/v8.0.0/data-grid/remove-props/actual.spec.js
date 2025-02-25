import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

function App() {
  return (
    <React.Fragment>
      <DataGrid
        indeterminateCheckboxAction="deselect"
        rowPositionsDebounceMs={100}
      />
      <DataGridPro
        indeterminateCheckboxAction="select"
        rowPositionsDebounceMs={100}
      />
      <DataGridPremium
        indeterminateCheckboxAction="deselect"
        rowPositionsDebounceMs={100}
      />
    </React.Fragment>
  );
}

export default App;
