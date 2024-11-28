import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Grid.ColumnsPanel.Trigger render={<Grid.Toolbar.Button />}>
        <ViewColumnIcon fontSize="small" />
        Columns
      </Grid.ColumnsPanel.Trigger>
    </Grid.Toolbar.Root>
  );
}

export default function GridColumnsPanelTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
