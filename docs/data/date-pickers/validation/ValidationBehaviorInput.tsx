import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';

const tomorrow = dayjs().add(1, 'day');

export default function ValidationBehaviorInput() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateField defaultValue={tomorrow} disableFuture />
    </LocalizationProvider>
  );
}
