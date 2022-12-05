import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_StaticNextDateTimePicker as StaticNextDateTimePicker } from '@mui/x-date-pickers/StaticNextDateTimePicker';

export default function StaticDateTimePickerDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDateTimePicker
        displayStaticWrapperAs="desktop"
        defaultValue={dayjs('2022-04-07T15:30')}
      />
    </LocalizationProvider>
  );
}
