import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/demo/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function FormPropsDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDatePicker label="disabled" disabled />
        <NextDatePicker label="readOnly" readOnly />
      </DemoContainer>
    </LocalizationProvider>
  );
}
