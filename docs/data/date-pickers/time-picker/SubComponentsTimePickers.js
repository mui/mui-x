import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ClockPicker } from '@mui/x-date-pickers/ClockPicker';

export default function SubComponentsTimePickers() {
  const [value, setValue] = React.useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClockPicker value={value} onChange={(newValue) => setValue(newValue)} />
    </LocalizationProvider>
  );
}
