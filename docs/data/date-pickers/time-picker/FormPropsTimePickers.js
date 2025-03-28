import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '../_shared/DemoContainer';

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
