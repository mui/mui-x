import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// https://github.com/mui/mui-x/issues/23101
export default function NvdaLabelRepeat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <button type="button">Before</button>
      <DatePicker
        slotProps={{
          textField: { variant: 'standard', label: 'Birth date', helperText: 'First helper' },
        }}
      />
      <DatePicker
        slotProps={{
          textField: { variant: 'standard', label: 'Due date', helperText: 'Second helper' },
        }}
      />
      <button type="button">After</button>
    </LocalizationProvider>
  );
}
