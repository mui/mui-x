import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

function App() {
  return (
    (<React.Fragment>
      <DataGrid />
      <DataGridPro />
      <DataGridPremium />
    </React.Fragment>)
  );
}

export default App;
