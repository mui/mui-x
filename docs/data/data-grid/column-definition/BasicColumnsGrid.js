import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

export default function BasicColumnsGrid() {
  return (
    <Box sx={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'username' }, { field: 'age' }]}
        rows={[
          {
            id: 1,
            username: '@MUI',
            age: 20,
          },
        ]}
      />
    </Box>
  );
}
