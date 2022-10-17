import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateTimeField as DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function BasicDateTimeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimeField label="Basic date time field" sx={{ width: 300 }} />
    </LocalizationProvider>
  );
}
