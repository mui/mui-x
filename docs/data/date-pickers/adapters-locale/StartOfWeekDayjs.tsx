import * as React from 'react';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  weekStart: 1,
});

export default function StartOfWeekDayjs() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar defaultValue={dayjs('2022-04-17')} />
    </LocalizationProvider>
  );
}
