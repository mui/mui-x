import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
// import { Unstable_SingleInputDateTimeRangeField as SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';

export default function BasicDateDateTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <MultiInputDateTimeRangeField />
        {/*<SingleInputDateTimeRangeField />*/}
      </Stack>
    </LocalizationProvider>
  );
}
