import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function DateRangeCalendarCalendarsProp() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar', 'DateRangeCalendar']}>
        <DemoItem label="1 calendar">
          <DateRangeCalendar calendars={1} />
        </DemoItem>
        <DemoItem label="2 calendars">
          <DateRangeCalendar calendars={2} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
