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
            // moment-hijri support dates between 1356-01-01 and 1499-12-29 H (1937-03-14 and 2076-11-26)
            minDate={moment(new Date(1938, 0, 1))}
            maxDate={moment(new Date(2075, 11, 31))}
          />
        </LocalizationProvider>
      </div>
    </ThemeProvider>
  );
}
