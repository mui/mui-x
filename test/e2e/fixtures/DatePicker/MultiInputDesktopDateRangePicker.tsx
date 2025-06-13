import * as React from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

export default function MultiInputDesktopDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker slots={{ field: MultiInputDateRangeField }} />
    </LocalizationProvider>
  );
}
