import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const columns = [{ field: 'id' }, { field: 'firstName' }, { field: 'lastName' }];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
];

export default function DataGridDemo() {
  const theme = createTheme({
    typography: {
      body2: {
        fontSize: 14,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </ThemeProvider>
  );
}
