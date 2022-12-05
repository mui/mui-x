import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Unstable_StaticNextDateRangePicker as StaticNextDateRangePicker } from '@mui/x-date-pickers-pro/StaticNextDateRangePicker';

export default function StaticDateRangePickerDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDateRangePicker
        displayStaticWrapperAs="desktop"
        defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
      />
    </LocalizationProvider>
  );
}
