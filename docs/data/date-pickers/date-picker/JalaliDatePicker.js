import * as React from 'react';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function JalaliDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
      <NextDatePicker defaultValue={new Date(2022, 3, 7)} />
    </LocalizationProvider>
  );
}
