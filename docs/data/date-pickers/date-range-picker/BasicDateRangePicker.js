import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

export default function BasicDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
