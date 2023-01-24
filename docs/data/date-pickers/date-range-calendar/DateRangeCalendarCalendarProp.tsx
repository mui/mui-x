import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

export default function DateRangeCalendarCalendarProp() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateRangeCalendar", "DateRangeCalendar"]}>
        <DemoItem label="1 calendar" components={["DateRangeCalendar"]}>
          <DateRangeCalendar calendars={1} />
        </DemoItem>
        <DemoItem label="2 calendars" components={["DateRangeCalendar"]}>
          <DateRangeCalendar calendars={2} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
