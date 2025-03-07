import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';

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
