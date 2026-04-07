import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', flex: 1 },
  { field: 'lastName', headerName: 'Last name', flex: 1 },
  { field: 'age', headerName: 'Age', type: 'number', width: 80 },
  { field: 'email', headerName: 'Email', flex: 2 },
];

const rows = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  firstName: `First ${i + 1}`,
  lastName: `Last ${i + 1}`,
  age: 20 + (i % 50),
  email: `user${i + 1}@example.com`,
}));

export default function VirtualizerLayoutMode() {
  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          experimentalFeatures={{ virtualizerLayoutMode: 'controlled' }}
        />
      </div>
    </Stack>
  );
}
