import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DataGrid } from '@mui/x-data-grid/DataGrid';

const theme = createTheme({});

function App() {
  return (
    (<ThemeProvider theme={theme}>
      <DataGrid
        slotProps={{
          toolbar: {
            color: 'primary',
          },
        }} />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <DateRangePicker
          slotProps={{
            textField: { variant: 'filled' }
          }} />
      </LocalizationProvider>
    </ThemeProvider>)
  );
}

export default App;
