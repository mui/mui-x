import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_StaticNextTimePicker as StaticNextTimePicker } from '@mui/x-date-pickers/StaticNextTimePicker';

export default function StaticTimePickerDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextTimePicker />
    </LocalizationProvider>
  );
}
