import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Grid.QuickFilter.Root>
        <label htmlFor="search">Search</label>
        <Grid.QuickFilter.Control id="search" render={<input />} />
        <Grid.QuickFilter.Clear render={<button type="button">Clear</button>} />
      </Grid.QuickFilter.Root>
    </Grid.Toolbar.Root>
  );
}

export default function GridQuickFilterCustom() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
