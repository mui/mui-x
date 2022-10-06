import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';

export default function BasicDateRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <MultiInputDateRangeField />
        <SingleInputDateRangeField />
        {/* For experiment reasons (will be removed) */}
        <MultiInputDateTimeRangeField />
      </Stack>
    </LocalizationProvider>
  );
}
