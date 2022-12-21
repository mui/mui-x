import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_StaticNextTimePicker as StaticNextTimePicker } from '@mui/x-date-pickers/StaticNextTimePicker';

export default function StaticTimePickerLandscape() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextTimePicker
        defaultValue={dayjs('2022-04-07')}
        orientation="landscape"
      />
    </LocalizationProvider>
  );
}
