import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { SimpleValue } from '@mui/x-date-pickers/models';

export default function DateCalendarValue() {
  const [value, setValue] = React.useState<SimpleValue>(dayjs('2022-04-17'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar']}>
        <DemoItem label="Uncontrolled calendar">
          <DateCalendar defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Controlled calendar">
          <DateCalendar value={value} onChange={setValue} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
