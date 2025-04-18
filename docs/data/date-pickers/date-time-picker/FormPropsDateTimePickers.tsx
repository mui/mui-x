import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '../_shared/DemoContainer';

export default function FormPropsDateTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateTimePicker', 'DateTimePicker', 'DateTimePicker']}
      >
        <DateTimePicker label="disabled" disabled />
        <DateTimePicker label="readOnly" readOnly />
        <DateTimePicker label="name" name="startDateTime" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
