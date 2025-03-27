// @ts-nocheck
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const dataSource = {
  getRows: () => Promise.resolve([]),
};
const dataSourceCache = {};

// prettier-ignore
function App() {
  return (
    (<React.Fragment>
      <DataGrid
        rowSpanning
      />
      <DataGridPro
        rowSpanning
      />
      <DataGridPremium
        rowSpanning
        dataSource={dataSource}
        dataSourceCache={dataSourceCache}
      />
    </React.Fragment>)
  );
}

export default App;
