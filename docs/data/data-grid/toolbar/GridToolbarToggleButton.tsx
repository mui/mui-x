import * as React from 'react';
import { DataGrid, GridToolbarV8 as GridToolbar } from '@mui/x-data-grid';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';

function Toolbar() {
  const [pivotEnabled, setPivotEnabled] = React.useState(false);

  return (
    <GridToolbar.Root>
      <GridToolbar.ToggleButton
        color="primary"
        value="filters"
        selected={pivotEnabled}
        onChange={() => setPivotEnabled(!pivotEnabled)}
      >
        <PivotTableChartIcon fontSize="small" /> Pivot
      </GridToolbar.ToggleButton>
    </GridToolbar.Root>
  );
}

export default function GridToolbarToggleButton() {
  return (
    <div style={{ height: 48, width: '100%' }}>
      <DataGrid columns={[]} rows={[]} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
