import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DayjsUtils from '@date-io/dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={DayjsUtils} locale="fr">
        <CalendarPicker date={null} onChange={() => {}} />
        <DateRangePicker cancelText={custom_cancelText} okText="string_okText" />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
