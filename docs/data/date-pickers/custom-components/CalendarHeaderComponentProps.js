import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DemoContainer } from '../_shared/DemoContainer';

export default function CalendarHeaderComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar
          slotProps={{ calendarHeader: { sx: { border: '1px red solid' } } }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
