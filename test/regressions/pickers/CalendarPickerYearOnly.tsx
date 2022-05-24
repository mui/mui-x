import * as React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';

const adapterToUse = new AdapterDateFns();

export default function CalendarPickerYearOnly() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CalendarPicker
        views={['year']}
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={() => {}}
      />
    </LocalizationProvider>
  );
}
