import * as React from 'react';
import { DataGrid, GridRowData } from '@mui/x-data-grid';

interface ColumnWidthGridRow {
  id: number;
  username: string;
  age: number;
}

const rows: GridRowData<ColumnWidthGridRow>[] = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 38,
  },
];

export default function ColumnWidthGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'username', width: 200 }, { field: 'age' }]}
        rows={rows}
      />
    </div>
  );
}
