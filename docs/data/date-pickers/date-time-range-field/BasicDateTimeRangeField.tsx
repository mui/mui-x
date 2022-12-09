import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';

export default function BasicDateTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MultiInputDateTimeRangeField />
    </LocalizationProvider>
  );
}
