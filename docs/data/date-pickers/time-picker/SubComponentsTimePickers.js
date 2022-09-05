import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ClockPicker } from '@mui/x-date-pickers/ClockPicker';

export default function SubComponentsTimePickers() {
  const [date, setDate] = React.useState(dayjs('2022-04-07T10:15'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClockPicker date={date} onChange={(newDate) => setDate(newDate)} />
    </LocalizationProvider>
  );
}
