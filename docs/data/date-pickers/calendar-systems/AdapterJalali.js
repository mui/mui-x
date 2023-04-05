import * as React from 'react';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function AdapterJalali() {
  return (
    <ThemeProvider theme={(theme) => createTheme({ ...theme, direction: 'rtl' })}>
      <div dir="rtl">
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          <DateTimePicker label="Date Picker" defaultValue={new Date(2022, 1, 1)} />
        </LocalizationProvider>
      </div>
    </ThemeProvider>
  );
}
