import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

export default function CalendarsDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="1 calendar">
          <NextDateRangePicker calendars={1} />
        </DemoItem>
        <DemoItem label="2 calendars">
          <NextDateRangePicker calendars={2} />
        </DemoItem>
        <DemoItem label="3 calendars">
          <NextDateRangePicker calendars={3} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
