import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

const rows = [
  { id: 1, value: 'A' },
  { id: 2, value: 'B' },
  { id: 3, value: 'C' },
  { id: 4, value: 'D' },
  { id: 5, value: 'E' },
  { id: 6, value: 'E' },
  { id: 7, value: 'F' },
  { id: 8, value: 'G' },
  { id: 9, value: 'H' },
];

export default function DynamicVirtualizationRange() {
  const [columns, setColumns] = React.useState<GridColDef[]>([{ field: 'id' }, { field: 'value' }]);

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => setColumns([{ field: 'id' }])}>Update columns</Button>
      <div style={{ height: 400 }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
}
