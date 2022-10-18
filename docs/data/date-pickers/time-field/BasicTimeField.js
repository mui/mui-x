import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';

export default function BasicTimeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimeField label="Basic time field" />
    </LocalizationProvider>
  );
}
