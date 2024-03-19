import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

function App() {
  return (
    <React.Fragment>
      <DataGrid
        experimentalFeatures={{
          columnGrouping: true,
          clipboardPaste: true,
        }}
      />
      <DataGridPro
        experimentalFeatures={{
          lazyLoading: true,
          ariaV7: true,
        }}
      />
      <DataGridPremium
        experimentalFeatures={{
          columnGrouping: true,
          clipboardPaste: true,
          lazyLoading: true,
          ariaV7: true,
        }}
      />
      <DataGridPro {...props} />
    </React.Fragment>
  );
}

export default App;
