import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

export default function ColumnSizingGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'id' },
          { field: 'username', width: 125, minWidth: 150, maxWidth: 200 },
          { field: 'age', resizable: false },
        ]}
        rows={rows}
      />
    </div>
  );
}
