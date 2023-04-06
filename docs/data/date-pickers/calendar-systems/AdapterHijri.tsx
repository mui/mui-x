import * as React from 'react';
import moment from 'moment-hijri';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useTheme from '@mui/system/useTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function AdapterHijri() {
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () => createTheme({ direction: 'rtl' }, existingTheme),
    [existingTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <div dir="rtl">
        <LocalizationProvider dateAdapter={AdapterMomentHijri}>
          <DateTimePicker
            label="Date Picker"
            defaultValue={moment(new Date(2022, 1, 1))}
          />
        </LocalizationProvider>
      </div>
    </ThemeProvider>
  );
}
