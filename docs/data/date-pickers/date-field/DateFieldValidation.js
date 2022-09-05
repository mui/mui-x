import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';

const today = dayjs();

const isWeekend = (date) => {
  const day = date.day();

  return day === 0 || day === 6;
};

export default function DateFieldValidation() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <DateField
          label="props.minDate = today"
          defaultValue={today.subtract(1, 'day')}
          minDate={today}
        />
        <DateField
          label="props.maxDate = today"
          defaultValue={today.add(1, 'day')}
          maxDate={today}
        />
        <DateField
          label="props.disablePast = true"
          defaultValue={today.subtract(1, 'day')}
          disablePast
        />
        <DateField
          label="props.disableFuture = true"
          defaultValue={today.add(1, 'day')}
          disableFuture
        />
        <DateField
          label="shouldDisableDate = isWeekend"
          defaultValue={today}
          shouldDisableDate={isWeekend}
        />
      </Stack>
    </LocalizationProvider>
  );
}
