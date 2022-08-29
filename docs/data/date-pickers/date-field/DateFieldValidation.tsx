import * as React from 'react';
import addDays from 'date-fns/addDays';
import isWeekend from 'date-fns/isWeekend';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';

const today = new Date();

export default function DateFieldValidation() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2}>
        <DateField
          label="props.minDate = today"
          defaultValue={addDays(today, -1)}
          minDate={today}
        />
        <DateField
          label="props.maxDate = today"
          defaultValue={addDays(today, 1)}
          maxDate={today}
        />
        <DateField
          label="props.disablePast = true"
          defaultValue={addDays(today, -1)}
          disablePast
        />
        <DateField
          label="props.disableFuture = true"
          defaultValue={addDays(today, 1)}
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
