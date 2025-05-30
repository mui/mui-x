import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function MultiInputDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputDateRangeField']}>
        <DateRangePicker slots={{ field: MultiInputDateRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
