import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function DateCalendarViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar', 'DateCalendar']}>
        <DemoItem label={'"year", "month" and "day"'} component="DateCalendar">
          <DateCalendar defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label={'"day"'} component="DateCalendar">
          <DateCalendar views={['day']} />
        </DemoItem>
        <DemoItem label={'"month" and "year"'} component="DateCalendar">
          <DateCalendar defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
