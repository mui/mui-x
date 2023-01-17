import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

export default function DateRangePickerCalendarProp() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer content={['NextDateRangePicker']}>
        <DemoItem label="1 calendar" content={['NextDateRangePicker']}>
          <NextDateRangePicker calendars={1} />
        </DemoItem>
        <DemoItem label="2 calendars" content={['NextDateRangePicker']}>
          <NextDateRangePicker calendars={2} />
        </DemoItem>
        <DemoItem label="3 calendars" content={['NextDateRangePicker']}>
          <NextDateRangePicker calendars={3} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
