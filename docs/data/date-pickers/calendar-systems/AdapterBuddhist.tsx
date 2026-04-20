import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { AdapterDayjsBuddhist } from '@mui/x-date-pickers/AdapterDayjsBuddhist';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function AdapterBuddhist() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjsBuddhist} adapterLocale="th">
      <DateTimePicker
        label="AdapterDayjsBuddhist"
        defaultValue={dayjs(new Date(2022, 1, 1, 12))}
      />
    </LocalizationProvider>
  );
}
