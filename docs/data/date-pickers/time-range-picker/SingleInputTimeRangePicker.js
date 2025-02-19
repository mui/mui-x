import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function SingleInputTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <TimeRangePicker slots={{ field: SingleInputTimeRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
