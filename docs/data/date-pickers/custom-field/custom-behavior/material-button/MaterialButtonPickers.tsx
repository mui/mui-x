import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ButtonFieldDatePicker } from './ButtonFieldDatePicker';
import { ButtonFieldDateRangePicker } from './ButtonFieldDateRangePicker';

export default function MaterialButtonPickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ButtonFieldDatePicker />
      <ButtonFieldDateRangePicker />
    </LocalizationProvider>
  );
}
