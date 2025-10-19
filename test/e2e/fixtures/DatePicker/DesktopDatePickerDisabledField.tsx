import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function BasicDesktopDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DesktopDatePicker']}>
        <button type="button" data-testid="start-btn">
          Start Button
        </button>
        <DesktopDatePicker label="disabled" disabled />
        <button type="button" data-testid="end-btn">
          End Button
        </button>
      </DemoContainer>
    </LocalizationProvider>
  );
}
