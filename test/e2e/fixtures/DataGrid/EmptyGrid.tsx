import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', width: 100 },
  { field: 'column1', width: 100 },
  { field: 'column2', width: 100 },
  { field: 'column3', width: 100 },
  { field: 'column4', width: 100 },
  { field: 'column5', width: 100 },
  { field: 'column6', width: 100 },
];

export default function EmptyGrid() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid columns={columns} rows={[]} />
    </div>
  );
}
