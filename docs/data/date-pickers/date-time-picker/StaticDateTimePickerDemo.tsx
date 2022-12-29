import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_StaticNextDateTimePicker as StaticNextDateTimePicker } from '@mui/x-date-pickers/StaticNextDateTimePicker';

export default function StaticDateTimePickerDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDateTimePicker />
    </LocalizationProvider>
  );
}
