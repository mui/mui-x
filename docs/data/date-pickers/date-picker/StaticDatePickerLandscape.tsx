import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';

export default function StaticDatePickerLandscape() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker orientation="landscape" />
    </LocalizationProvider>
  );
}
