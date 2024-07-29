import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import moment from 'moment-jalaali';
import 'moment/locale/fa';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function MomentJalaliDateCalendar() {
  moment.loadPersian({ dialect: 'persian-modern' });

  return (
    <LocalizationProvider dateAdapter={AdapterMomentJalaali} adapterLocale="fa">
      <DateCalendar />
    </LocalizationProvider>
  );
}
