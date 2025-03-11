import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
];

export default function DynamicRowHeight() {
  return (
    <div style={{ height: 300, width: 400 }}>
      <DataGrid rows={rows} columns={[{ field: 'id' }]} getRowHeight={() => 'auto'} />
    </div>
  );
}
