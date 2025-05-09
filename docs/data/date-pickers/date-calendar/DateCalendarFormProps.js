import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function DateCalendarFormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar']}>
        <DemoItem label="disabled">
          <DateCalendar defaultValue={dayjs('2022-04-17')} disabled />
        </DemoItem>
        <DemoItem label="readOnly">
          <DateCalendar defaultValue={dayjs('2022-04-17')} readOnly />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
