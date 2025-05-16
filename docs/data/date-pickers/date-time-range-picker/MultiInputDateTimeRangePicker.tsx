import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function MultiInputDateTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputDateTimeRangeField']}>
        <DateTimeRangePicker slots={{ field: MultiInputDateTimeRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
