import * as React from 'react';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

export default function StartOfWeekMoment() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateCalendar defaultValue={moment('2022-04-17')} />
    </LocalizationProvider>
  );
}
