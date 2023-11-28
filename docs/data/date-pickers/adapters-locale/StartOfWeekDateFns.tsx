import * as React from 'react';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

setDefaultOptions({ weekStartsOn: 1 });

export default function StartOfWeekDateFns() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar defaultValue={new Date('2022-04-17')} />
    </LocalizationProvider>
  );
}
