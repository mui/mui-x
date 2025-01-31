import * as React from 'react';
import { DataGrid, Toolbar, ColumnsPanel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

function CustomToolbar() {
  return (
    <Toolbar.Root>
      <Tooltip title="Columns">
        <ColumnsPanel.Trigger render={<Toolbar.Button />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanel.Trigger>
      </Tooltip>
    </Toolbar.Root>
  );
}

export default function GridColumnsPanelTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} slots={{ toolbar: CustomToolbar }} />
    </div>
  );
}
