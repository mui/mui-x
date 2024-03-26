import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function FormPropsTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker', 'TimePicker', 'TimePicker']}>
        <TimePicker label="disabled" disabled />
        <TimePicker label="readOnly" readOnly />
        <TimePicker label="name" name="startTime" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
