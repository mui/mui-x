import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { randomTraderName, randomEmail } from '@mui/x-data-grid-generator';

const columns = [
  { field: 'name', headerName: 'Name', width: 160 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', headerName: 'Age', type: 'number' },
];

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
  },
];

export default function DataGridPinnedColumnsBordered() {
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
