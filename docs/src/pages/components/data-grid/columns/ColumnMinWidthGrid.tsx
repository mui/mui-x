import * as React from 'react';
import { DataGrid, GridRowData } from '@mui/x-data-grid';

interface ColumnMinWidthGridRow {
  id: number;
  username: string;
  age: number;
}

const rows: GridRowData<ColumnMinWidthGridRow>[] = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 38,
  },
];

export default function ColumnMinWidthGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'username', minWidth: 150 }, { field: 'age' }]}
        rows={rows}
      />
    </div>
  );
}
