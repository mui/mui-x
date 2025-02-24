import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function MultiInputTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputTimeRangeField']}>
        <TimeRangePicker slots={{ field: MultiInputTimeRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
