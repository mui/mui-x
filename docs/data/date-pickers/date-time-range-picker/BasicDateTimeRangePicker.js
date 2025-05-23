import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { DemoContainer } from '../_shared/DemoContainer';

export default function BasicDateTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimeRangePicker']}>
        <DateTimeRangePicker />
      </DemoContainer>
    </LocalizationProvider>
  );
}
