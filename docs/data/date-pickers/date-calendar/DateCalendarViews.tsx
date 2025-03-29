import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function DateCalendarViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar', 'DateCalendar']}>
        <DemoItem label={'"year", "month" and "day"'}>
          <DateCalendar
            defaultValue={dayjs('2022-04-17')}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label={'"day"'}>
          <DateCalendar views={['day']} />
        </DemoItem>
        <DemoItem label={'"month" and "year"'}>
          <DateCalendar
            defaultValue={dayjs('2022-04-17')}
            views={['month', 'year']}
            openTo="month"
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
