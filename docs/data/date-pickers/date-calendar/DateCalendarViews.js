import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function DateCalendarViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label={'"year", "month" and "day"'}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label={'"day"'}>
          <DateCalendar views={['day']} />
        </DemoItem>
        <DemoItem label={'"month" and "year"'}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
