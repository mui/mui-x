import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const dataSource = {
  getRows: () => Promise.resolve([]),
}

const dataSourceCache = {}

function App() {
  return (
    <React.Fragment>
      <DataGrid
        unstable_rowSpanning
      />
      <DataGridPro
        unstable_rowSpanning
        unstable_dataSource={dataSource}
        unstable_dataSourceCache={dataSourceCache}
        unstable_onDataSourceError={() => {}}
      />
      <DataGridPremium
        unstable_rowSpanning
        unstable_dataSource={dataSource}
        unstable_dataSourceCache={dataSourceCache}
        unstable_lazyLoading
        unstable_lazyLoadingRequestThrottleMs={100}
        unstable_listView
        unstable_listColumn={{}}
      />
    </React.Fragment>
  );
}

export default App;
