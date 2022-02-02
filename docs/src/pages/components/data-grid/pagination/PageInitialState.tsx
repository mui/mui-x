import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function PageInitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  if (loading) {
    return null;
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        initialState={{
          ...data.initialState,
          pagination: {
            page: 1,
          },
        }}
        pageSize={5}
        rowsPerPageOptions={[5]}
        pagination
      />
    </div>
  );
}
