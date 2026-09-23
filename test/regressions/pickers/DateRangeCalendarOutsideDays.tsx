import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

// With a single calendar and `showDaysOutsideCurrentMonth`, the days of the neighbouring
// months are rendered, so the range highlight must run through them instead of being
// closed at the first and last day of the month.
const value: [Dayjs, Dayjs] = [dayjs('2026-08-26'), dayjs('2026-10-02')];

export default function DateRangeCalendarOutsideDays() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeCalendar calendars={1} value={value} showDaysOutsideCurrentMonth />
    </LocalizationProvider>
  );
}
