import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getSynchronousDemoData } from '@mui/x-data-grid-generator';

const data = getSynchronousDemoData({
  dataSet: 'Commodity',
  rowLength: 100,
  maxColumns: 6,
});

export default function PageInitialState() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        initialState={{
          pagination: {
            page: 1,
          },
        }}
        pageSize={5}
        rowsPerPageOptions={[5]}
        pagination
        {...data}
      />
    </div>
  );
}
