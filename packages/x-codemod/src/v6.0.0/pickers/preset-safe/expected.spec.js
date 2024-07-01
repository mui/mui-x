import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const theme = createTheme({});

function App() {
  return (
    (<ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="fr"
        localeText={{
          datePickerToolbarTitle: 'Pick a Date',
        }}
      >
        <DateCalendar
          value={null}
          onChange={() => {}}
          components={{
            PreviousIconButton: CustomButtonLeft,
          }}
        />
        <DateRangePicker
          localeText={{
            cancelButtonLabel: custom_cancelText,
            okButtonLabel: "string_okText"
          }} />
        <DateTimePicker
          shouldDisableClock={(timeValue, view) => view === 'hours' && timeValue < 12}
          format="YYYY-MM-DD HH:mm"
          components={{
            DesktopTransition: Fade,
          }}
          componentsProps={{
            tabs: {
              hidden: false,
              dateIcon: <LightModeIcon />,
            },

            dialog: { backgroundColor: 'red' },
          }} />
        <DateRangePicker
          components={{
            Toolbar: CustomToolbarComponent,
          }}
          localeText={{
            toolbarTitle: "Title",
          }}
          componentsProps={{
            toolbar: {
              hidden: false,
            },
          }} />
      </LocalizationProvider>
    </ThemeProvider>)
  );
}

export default App;
