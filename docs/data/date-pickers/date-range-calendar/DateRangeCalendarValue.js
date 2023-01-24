import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

export default function DateRangeCalendarValue() {
  const [value, setValue] = React.useState([
    dayjs('2022-04-07'),
    dayjs('2022-04-10'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar', 'DateRangeCalendar']}>
        <DemoItem label="Uncontrolled calendar" component="DateRangeCalendar">
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Controlled calendar" component="DateRangeCalendar">
          <DateRangeCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
