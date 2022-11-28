import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';

export default function BasicTimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextTimePicker label="Basic time picker" />
    </LocalizationProvider>
  );
}
