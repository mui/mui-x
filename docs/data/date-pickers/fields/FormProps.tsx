import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

const defaultValue = dayjs('2022-04-07');

export default function FormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={(theme) => ({ width: theme.spacing(48) })}>
        <DateField label="Disabled" defaultValue={defaultValue} disabled />
        <DateField label="Read only" defaultValue={defaultValue} readOnly />
      </Stack>
    </LocalizationProvider>
  );
}
