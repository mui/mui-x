import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { Unstable_SingleInputDateTimeRangeField as SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';

export default function BasicDateTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <MultiInputDateTimeRangeField />
        <SingleInputDateTimeRangeField />
      </DemoContainer>
    </LocalizationProvider>
  );
}
