import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

// A fully disabled calendar dims the selected range as a whole, unlike a calendar
// where only some dates are disabled (see DateRangeCalendarDisabledDays).
const value: [Dayjs, Dayjs] = [dayjs('2026-09-14'), dayjs('2026-10-30')];

export default function DateRangeCalendarDisabled() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeCalendar calendars={2} value={value} disabled />
    </LocalizationProvider>
  );
}
