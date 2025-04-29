import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DataGrid } from '@mui/x-data-grid';

const theme = createTheme({});

function App() {
  return (
    (<ThemeProvider theme={theme}>
      <DataGrid
        disableMultipleRowSelection
        showCellVerticalBorder
        pageSizeOptions={[5]}
        filterModel={{
          items: [
            {
              field: 'column',
              operator: 'contains',
              value: 'a',
            },
          ],
        }}
        componentsProps={{
          cell: {
            onBlur: handleCellFocusOut,
          },
        }} />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <DateCalendar value={null} onChange={(value) => { console.info(value?.toString()) }} />
        <DateRangePicker
          localeText={{
            cancelButtonLabel: custom_cancelText,
            okButtonLabel: "string_okText"
          }} />
      </LocalizationProvider>
    </ThemeProvider>)
  );
}

export default App;
