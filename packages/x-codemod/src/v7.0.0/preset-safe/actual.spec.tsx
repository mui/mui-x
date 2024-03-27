// @ts-nocheck
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const theme = createTheme({});

const columns = [
  { field: 'id', headerName: 'ID', width: 90 } satisfies GridColDef,
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        columns={columns}
        componentsProps={{
          toolbar: {
            color: 'primary',
          },
        }} />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <DateRangePicker
          componentsProps={{
            textField: { variant: 'filled' }
          }} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
