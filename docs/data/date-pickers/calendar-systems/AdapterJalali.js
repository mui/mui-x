import * as React from 'react';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({ direction: 'rtl' });

export default function AdapterJalali() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
        <DatePicker label="Date Picker" defaultValue={new Date(2022, 1, 1)} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
