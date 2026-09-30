import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

// September 2026 ends on a Wednesday, so its grid is padded with filler cells for
// October 1 to October 3. October 3 is a Saturday, so it is a disabled filler cell
// inside the selected range: it must stay invisible instead of rendering the range
// highlight without a day number.
// See https://github.com/mui/mui-x/issues/23289
const value: [Dayjs, Dayjs] = [dayjs('2026-09-14'), dayjs('2026-10-30')];

const isWeekend = (date: Dayjs) => {
  const day = date.day();
  return day === 0 || day === 6;
};

export default function DateRangeCalendarDisabledDays() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeCalendar calendars={2} value={value} shouldDisableDate={isWeekend} />
    </LocalizationProvider>
  );
}
