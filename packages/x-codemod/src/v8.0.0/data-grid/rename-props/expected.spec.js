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
    (<React.Fragment>
      <DataGrid
        rowSpanning
      />
      <DataGridPro
        rowSpanning
        dataSource={dataSource}
        dataSourceCache={dataSourceCache}
        onDataSourceError={() => {}}
      />
      <DataGridPremium
        rowSpanning
        dataSource={dataSource}
        dataSourceCache={dataSourceCache}
        lazyLoading
        lazyLoadingRequestThrottleMs={100}
        listView
        listViewColumn={{}}
      />
    </React.Fragment>)
  );
}

export default App;
