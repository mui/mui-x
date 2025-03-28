import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { DemoContainer } from '../_shared/DemoContainer';

export default function FormPropsTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeRangePicker', 'TimeRangePicker']}>
        <TimeRangePicker label="disabled" disabled />
        <TimeRangePicker label="readOnly" readOnly />
        <TimeRangePicker label="name" name="startTimeRange" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
