import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

function App() {
  return (
    <React.Fragment>
      <DataGrid />
      <DataGridPro experimentalFeatures={{
        rowPinning: true,
      }} />
      <DataGridPremium
        experimentalFeatures={{
          rowPinning: true,
          columnGrouping: true,
        }} />
    </React.Fragment>
  );
}

export default App;
