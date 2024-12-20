import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const TOOLBAR_STYLES = {
  display: 'flex',
  gap: 8,
  borderBottom: '1px solid #e0e0e0',
  padding: 8,
};

function Toolbar() {
  return (
    <Grid.Toolbar.Root render={<div style={TOOLBAR_STYLES} />}>
      <Grid.ColumnsPanel.Trigger
        render={
          <Grid.Toolbar.Button render={<button type="button">Columns</button>} />
        }
      />
      <Grid.FilterPanel.Trigger
        render={
          <Grid.Toolbar.Button render={<button type="button">Filter</button>} />
        }
      />
      <Grid.Export.CsvTrigger
        render={
          <Grid.Toolbar.Button render={<button type="button">Export CSV</button>} />
        }
      />
      <Grid.Export.PrintTrigger
        render={
          <Grid.Toolbar.Button render={<button type="button">Print</button>} />
        }
      />
      <Grid.QuickFilter.Root>
        <label htmlFor="search">Search</label>
        <Grid.QuickFilter.Control id="search" render={<input />} />
        <Grid.QuickFilter.Clear render={<button type="button">Clear</button>} />
      </Grid.QuickFilter.Root>
    </Grid.Toolbar.Root>
  );
}

export default function GridToolbarCustom() {
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
