import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { DataGridPremium } from '@mui/x-data-grid-premium';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      DataGrid: {
        bg: mode === 'light' ? '#f8fafc' : '#334155',
        pinnedBg: mode === 'light' ? '#f1f5f9' : '#293548',
        headerBg: mode === 'light' ? '#eaeff5' : '#1e293b',
      },
    },
  });

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function BackgroundColorsGrid() {
  const [mode, setMode] = React.useState('light');
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <Stack direction="column" gap={1} style={{ width: '100%', height: 400 }}>
      <ToggleButtonGroup
        size="small"
        color="primary"
        value={mode}
        onChange={(event, value) => setMode(value === null ? mode : value)}
        exclusive
      >
        <ToggleButton value="light" aria-label="Light mode" sx={{ gap: 1 }}>
          <LightModeIcon fontSize="small" /> Light
        </ToggleButton>
        <ToggleButton value="dark" aria-label="Dark mode" sx={{ gap: 1 }}>
          <DarkModeIcon fontSize="small" /> Dark
        </ToggleButton>
      </ToggleButtonGroup>

      <ThemeProvider theme={theme}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
            pinnedColumns: {
              left: ['id'],
            },
          }}
          pinnedRows={{
            bottom: [rows[0]],
          }}
        />
      </ThemeProvider>
    </Stack>
  );
}
