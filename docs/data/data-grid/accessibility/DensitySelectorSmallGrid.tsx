import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridDensity,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
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
      />
    </div>
  );
}
