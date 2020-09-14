import * as React from 'react';
import { GridOverlay, DataGrid } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDemoData } from '@material-ui/x-grid-data-generator';

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function CustomLoadingOverlayGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        components={{
          loadingOverlay: CustomLoadingOverlay,
        }}
        loading
        {...data}
      />
    </div>
  );
}
