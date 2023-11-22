import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DayjsUtils from '@date-io/dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DataGrid } from '@mui/x-data-grid';

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        disableMultipleSelection
        showCellRightBorder
        disableExtendRowFullWidth
        rowsPerPageOptions={[5]}
        filterModel={{
          items: [
            {
              columnField: 'column',
              operatorValue: 'contains',
              value: 'a',
            },
          ],
        }}
        experimentalFeatures={{ newEditingApi: true }}
        onCellFocusOut={handleCellFocusOut}
      />
      <LocalizationProvider dateAdapter={DayjsUtils} locale="fr">
        <CalendarPicker date={null} onChange={(value) => { console.info(value?.toString()) }} />
        <DateRangePicker cancelText={custom_cancelText} okText="string_okText" />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
