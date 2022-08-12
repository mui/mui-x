import * as React from 'react';
import addDays from 'date-fns/addDays';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';

const today = new Date();

export default function DateFieldValidation() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2} sx={(theme) => ({ width: theme.spacing(48) })}>
        <DateField
          label="Min date (today)"
          defaultValue={addDays(today, -1)}
          minDate={today}
        />
        <DateField
          label="Max date (today)"
          defaultValue={addDays(today, 1)}
          maxDate={today}
        />
        <DateField
          label="Disable past"
          defaultValue={addDays(today, -1)}
          disablePast
        />
        <DateField
          label="Disable future"
          defaultValue={addDays(today, 1)}
          disableFuture
        />
      </Stack>
    </LocalizationProvider>
  );
}
