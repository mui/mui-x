import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DemoContainer } from '../_shared/DemoContainer';

export default function DateCalendarReferenceDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar
          referenceDate={dayjs('2022-04-17')}
          views={['year', 'month', 'day']}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
