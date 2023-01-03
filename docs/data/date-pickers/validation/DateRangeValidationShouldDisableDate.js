import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

const lastSunday = dayjs().startOf('week').subtract(1, 'day');
const nextSunday = dayjs().endOf('week').startOf('day');

const isWeekend = (date) => {
  const day = date.day();

  return day === 0 || day === 6;
};

export default function DateRangeValidationShouldDisableDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextDateRangePicker
        defaultValue={[lastSunday, nextSunday]}
        shouldDisableDate={(date, position) => {
          if (position === 'end') {
            return false;
          }

          return isWeekend(date);
        }}
      />
    </LocalizationProvider>
  );
}
