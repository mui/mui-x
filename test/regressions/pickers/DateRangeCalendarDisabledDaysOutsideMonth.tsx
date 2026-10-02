import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

// With `showDaysOutsideCurrentMonth`, a disabled day outside the current month
// must use the disabled text color like any other disabled day.
const value: [Dayjs, Dayjs] = [dayjs('2026-09-14'), dayjs('2026-09-25')];

const isWeekend = (date: Dayjs) => {
  const day = date.day();
  return day === 0 || day === 6;
};

export default function DateRangeCalendarDisabledDaysOutsideMonth() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeCalendar
        calendars={1}
        value={value}
        shouldDisableDate={isWeekend}
        showDaysOutsideCurrentMonth
      />
    </LocalizationProvider>
  );
}
