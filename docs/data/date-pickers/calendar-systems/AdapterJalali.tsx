import * as React from 'react';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function AdapterJalali() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
      <DatePicker label="Date Picker" defaultValue={new Date(2022, 1, 1)} />
    </LocalizationProvider>
  );
}
