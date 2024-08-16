import * as React from 'react';
import { DataGridPro, gridClasses } from '@mui/x-data-grid-pro';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

const columns = [
  {
    field: 'id',
  },
  {
    field: 'username',
    width: 200,
    resizable: false,
  },
  {
    field: 'age',
    width: 100,
    resizable: false,
  },
];

export default function ColumnHeaderHideSeparator() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        sx={{
          [`& .${gridClasses.columnSeparator}`]: {
            [`&:not(.${gridClasses['columnSeparator--resizable']})`]: {
              display: 'none',
            },
          },
        }}
      />
    </div>
  );
}
