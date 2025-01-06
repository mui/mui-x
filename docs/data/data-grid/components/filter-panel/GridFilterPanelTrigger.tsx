import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Tooltip title="Filters">
        <Grid.FilterPanel.Trigger render={<Grid.Toolbar.Button />}>
          <FilterListIcon fontSize="small" />
        </Grid.FilterPanel.Trigger>
      </Tooltip>
    </Grid.Toolbar.Root>
  );
}

export default function GridFilterPanelTrigger() {
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
