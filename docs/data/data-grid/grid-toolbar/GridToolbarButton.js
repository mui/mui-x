import * as React from 'react';
import { DataGrid, GridToolbarV8 as GridToolbar } from '@mui/x-data-grid';
import PrintIcon from '@mui/icons-material/Print';

function Toolbar() {
  return (
    <GridToolbar.Root>
      <GridToolbar.ToggleButton value="filters">
        <PrintIcon fontSize="small" /> Print
      </GridToolbar.ToggleButton>
    </GridToolbar.Root>
  );
}

export default function GridToolbarButton() {
  return (
    <div style={{ height: 48, width: '100%' }}>
      <DataGrid columns={[]} rows={[]} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
