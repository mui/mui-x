import * as React from 'react';
import moment from 'moment-hijri';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({ direction: 'rtl' });

export default function AdapterHijri() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMomentHijri}>
        <DatePicker
          label="Date Picker"
          defaultValue={moment(new Date(2022, 1, 1))}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
