import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridDensitySelector,
} from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridDensitySelector />
    </GridToolbarContainer>
  );
}

export default function DensitySelectorGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
