import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

function App() {
  return (
    <React.Fragment>
      <DataGrid disableExtendRowFullWidth />
      <DataGridPro disableExtendRowFullWidth />
      <DataGridPremium disableExtendRowFullWidth />
    </React.Fragment>
  );
}

export default App;
