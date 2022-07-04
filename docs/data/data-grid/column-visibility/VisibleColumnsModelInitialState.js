import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

export default function VisibleColumnsModelInitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          columns: {
            columnVisibilityModel: {
              id: false,
              brokerId: false,
              status: false,
            },
          },
        }}
      />
    </div>
  );
}
