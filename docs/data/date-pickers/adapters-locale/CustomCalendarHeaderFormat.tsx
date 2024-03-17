import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

export default function CustomCalendarHeaderFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateRangeCalendar']}>
        <DateCalendar
          defaultValue={dayjs('2022-04-17')}
          slotProps={{ calendarHeader: { format: 'MM/YYYY' } }}
        />
        <DateRangeCalendar
          defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
          calendars={2}
          slotProps={{ calendarHeader: { format: 'MM/YYYY' } }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
