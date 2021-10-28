import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';

const xyRows = [
  { id: 1, x: 1, y: 1 },
  { id: 2, x: 1, y: 2 },
  { id: 3, x: 1, y: 3 },
  { id: 4, x: 1, y: 4 },
  { id: 5, x: 1, y: 5 },
  { id: 6, x: 1, y: 6 },
  { id: 7, x: 1, y: 7 },
  { id: 8, x: 1, y: 8 },
  { id: 9, x: 1, y: 9 },
];

const xyColumns = [
  { field: 'x', type: 'number' },
  { field: 'y', type: 'number' },
];

export default function SmallAutoPageSizeLastPageSnap() {
  return (
    <div style={{ height: 400, width: 400 }}>
      <DataGrid autoPageSize rows={xyRows} columns={xyColumns} page={1} />
    </div>
  );
}
