import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

// A single day disabled in the middle of a week must only dim its own text:
// the range highlight has to stay continuous around it.
const value: [Dayjs, Dayjs] = [dayjs('2026-09-14'), dayjs('2026-09-25')];

const disabledDay = dayjs('2026-09-16');

export default function DateRangeCalendarSingleDisabledDay() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeCalendar
        calendars={1}
        value={value}
        shouldDisableDate={(date) => date.isSame(disabledDay, 'day')}
      />
    </LocalizationProvider>
  );
}
