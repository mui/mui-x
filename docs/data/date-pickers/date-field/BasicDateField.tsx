import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

export default function BasicDateField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateField label="Basic date field" />
    </LocalizationProvider>
  );
}
