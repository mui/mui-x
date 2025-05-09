import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar2 } from '@mui/x-date-pickers/DateCalendar2';

export default function DateCalendarWithMaterialDesignDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar2 />
    </LocalizationProvider>
  );
}
