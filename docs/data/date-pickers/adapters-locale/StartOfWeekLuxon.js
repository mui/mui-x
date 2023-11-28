import * as React from 'react';
import { DateTime, Settings, Info } from 'luxon';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// TODO: remove when `@types/luxon` add support for this object.
// @ts-ignore
Settings.defaultWeekSettings = {
  firstDay: 1,
  // Makes sure we don't loose the other information from `defautlWeekSettings
  // TODO: remove when `@types/luxon` add support for this method.
  // @ts-ignore
  minimalDays: Info.getMinimumDaysInFirstWeek(),
  // @ts-ignore
  weekend: Info.getWeekendWeekdays(),
};

console.log();

export default function StartOfWeekLuxon() {
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DateCalendar defaultValue={DateTime.fromISO('2022-04-17')} />
    </LocalizationProvider>
  );
}
