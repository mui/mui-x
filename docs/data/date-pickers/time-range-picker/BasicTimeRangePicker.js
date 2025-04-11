import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { DemoContainer } from '../_shared/DemoContainer';

export default function BasicTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeRangePicker']}>
        <TimeRangePicker />
      </DemoContainer>
    </LocalizationProvider>
  );
}
