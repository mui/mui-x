import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

function App() {
  return (
    <React.Fragment>
      <DataGrid
        experimentalFeatures={{
          newEditingApi: true,
          rowPinning: true,
        }}
      />
      <DataGridPro
        experimentalFeatures={{
          newEditingApi: true,
          rowPinning: true,
        }}
      />
      <DataGridPremium
        experimentalFeatures={{
          newEditingApi: true,
          rowPinning: true,
          columnGrouping: true,
          aggregation: true,
        }}
      />
      <DataGridPro {...props} />
    </React.Fragment>
  );
}

export default App;
