import * as React from 'react';
import { DataGrid, GridDensity, Toolbar, ToolbarRoot } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import GridDensitySelector from '../../../src/modules/components/GridDensitySelector';

function CustomToolbar() {
  return (
    <Toolbar
      render={
        <ToolbarRoot sx={{ minHeight: 'auto', p: 0.5, gap: 1, flexWrap: 'wrap' }} />
      }
    >
      <GridDensitySelector />
    </Toolbar>
  );
}

export default function DensitySelectorSmallGrid() {
  const [density, setDensity] = React.useState<GridDensity>('compact');

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        density={density}
        onDensityChange={(newDensity) => {
          console.info(`Density updated to: ${newDensity}`);
          setDensity(newDensity);
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}
