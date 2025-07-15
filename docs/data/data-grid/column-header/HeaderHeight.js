import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

const columns = [
  {
    field: 'username',
    headerName: 'Username',
    description:
      'The identification used by the person with access to the online service.',
  },
  { field: 'age', headerName: 'Age' },
];

export default function HeaderHeight() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} columnHeaderHeight={36} />
    </div>
  );
}
