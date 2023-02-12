import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DayjsUtils from '@date-io/dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={DayjsUtils}
        locale="fr"
        localeText={{
          datePickerDefaultToolbarTitle: 'Pick a Date',
        }}
      >
        <CalendarPicker
          date={null}
          onChange={() => {}}
          components={{
            LeftArrowButton: CustomButtonLeft,
          }}
        />
        <DateRangePicker cancelText={custom_cancelText} okText="string_okText" />
        <DateTimePicker
          hideTabs={false}
          dateRangeIcon={<LightModeIcon />}
          TransitionComponent={Fade}
          DialogProps={{ backgroundColor: 'red' }}
          shouldDisableTime={(timeValue, view) => view === 'hours' && timeValue < 12}
          inputFormat="YYYY-MM-DD HH:mm"
        />
        <DateRangePicker
          ToolbarComponent={CustomToolbarComponent}
          toolbarTitle="Title"
          showToolbar
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
