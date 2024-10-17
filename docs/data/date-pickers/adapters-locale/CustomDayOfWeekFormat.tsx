import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { SimpleValue } from '@mui/x-date-pickers/models';

export default function CustomDayOfWeekFormat() {
  const [value, setValue] = React.useState<SimpleValue>(dayjs('2022-04-17'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={setValue}
        dayOfWeekFormatter={(weekday) => `${(weekday as Dayjs).format('dd')}.`}
      />
    </LocalizationProvider>
  );
}
