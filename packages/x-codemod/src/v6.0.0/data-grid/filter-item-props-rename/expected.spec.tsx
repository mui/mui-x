import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [{ field: 'column' }];

const rows = [
  { id: 1, column: 'a' },
  { id: 2, column: 'b' },
  { id: 3, column: 'c' },
];

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      filterModel={{
        items: [
          {
            field: 'column',
            operator: 'contains',
            value: 'a',
          },
        ],
      }}
    />
  );
}
