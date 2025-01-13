import * as React from 'react';
import { DataGrid, Toolbar, FilterPanel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';

function CustomToolbar() {
  return (
    <Toolbar.Root>
      <Tooltip title="Filters">
        <FilterPanel.Trigger render={<Toolbar.Button />}>
          <FilterListIcon fontSize="small" />
        </FilterPanel.Trigger>
      </Tooltip>
    </Toolbar.Root>
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
      <DataGrid {...data} loading={loading} slots={{ toolbar: CustomToolbar }} />
    </div>
  );
}
