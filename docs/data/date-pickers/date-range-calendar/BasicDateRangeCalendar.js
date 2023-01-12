import * as React from 'react';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

export default function BasicDateRangeCalendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DateRangeCalendar />
      </DemoContainer>
    </LocalizationProvider>
  );
}
