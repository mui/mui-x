import * as React from 'react';
import {
  DataGrid,
  GridDensityComfortableIcon,
  GridDensityCompactIcon,
  GridDensityStandardIcon,
  GridToolbarV8 as GridToolbar,
} from '@mui/x-data-grid';

function Toolbar() {
  const [density, setDensity] = React.useState('standard');

  return (
    <GridToolbar.Root>
      <GridToolbar.ToggleButtonGroup value={density}>
        <GridToolbar.ToggleButton
          color="primary"
          value="compact"
          onChange={() => setDensity('compact')}
        >
          <GridDensityCompactIcon fontSize="small" />
        </GridToolbar.ToggleButton>
        <GridToolbar.ToggleButton
          color="primary"
          value="standard"
          onChange={() => setDensity('standard')}
        >
          <GridDensityStandardIcon fontSize="small" />
        </GridToolbar.ToggleButton>
        <GridToolbar.ToggleButton
          color="primary"
          value="comfortable"
          onChange={() => setDensity('comfortable')}
        >
          <GridDensityComfortableIcon fontSize="small" />
        </GridToolbar.ToggleButton>
      </GridToolbar.ToggleButtonGroup>
    </GridToolbar.Root>
  );
}

export default function GridToolbarToggleButtonGroup() {
  return (
    <div style={{ height: 48, width: '100%' }}>
      <DataGrid columns={[]} rows={[]} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
