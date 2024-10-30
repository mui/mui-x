import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const columns = [
  { field: 'name', headerName: 'Name', width: 160 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', headerName: 'Age', type: 'number' },
];

const rows = [
  {
    id: 1,
    name: 'Test User',
    email: 'testuser@mui.com',
    age: 40,
  },
];

export default function BasicColumnPinning() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        initialState={{ pinnedColumns: { left: ['name'], right: ['age'] } }}
        showCellVerticalBorder
        showColumnVerticalBorder
      />
    </div>
  );
}
