import * as React from 'react';
import Stack from '@mui/material/Stack';
import { DesktopDatePicker2 } from '@mui/x-date-pickers/DesktopDatePicker2';
import { MobileDatePicker2 } from '@mui/x-date-pickers/MobileDatePicker2';
import { DatePicker2 } from '@mui/x-date-pickers/DatePicker2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function NewDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <DatePicker2 label="Responsive" />
        <DesktopDatePicker2 label="Desktop" />
        <MobileDatePicker2 label="Mobile" />
      </Stack>
    </LocalizationProvider>
  );
}
