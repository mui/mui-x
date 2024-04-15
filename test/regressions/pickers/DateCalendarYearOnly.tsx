import * as React from 'react';
import { AdapterDateFns } from 'packages/adapters/x-adapter-date-fns-v2/src';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const adapterToUse = new AdapterDateFns();

export default function DateCalendarYearOnly() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar views={['year']} value={adapterToUse.date('2019-01-01T00:00:00.000')} />
    </LocalizationProvider>
  );
}
