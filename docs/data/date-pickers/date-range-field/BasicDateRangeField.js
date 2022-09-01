import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function BasicDateRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={4}>
        <MultiInputDateRangeField />
        <SingleInputDateRangeField />
      </Stack>
    </LocalizationProvider>
  );
}
