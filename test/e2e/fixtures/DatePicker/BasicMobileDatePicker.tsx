import * as React from 'react';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function BasicMobileDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker label="Mobile Date Picker" />
    </LocalizationProvider>
  );
}
