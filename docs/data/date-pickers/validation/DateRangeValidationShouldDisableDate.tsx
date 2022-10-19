import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const lastSunday = dayjs().startOf('week').subtract(1, 'day');
const nextSunday = dayjs().endOf('week').startOf('day');

const isWeekend = (date: Dayjs) => {
  const day = date.day();

  return day === 0 || day === 6;
};

export default function DateRangeValidationShouldDisableDate() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([
    lastSunday,
    nextSunday,
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        shouldDisableDate={(date, position) => {
          if (position === 'end') {
            return false;
          }

          return isWeekend(date);
        }}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
}
