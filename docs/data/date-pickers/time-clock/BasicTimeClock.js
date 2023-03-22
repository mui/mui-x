import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function BasicTimeClock() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimeClock />
    </LocalizationProvider>
  );
}
