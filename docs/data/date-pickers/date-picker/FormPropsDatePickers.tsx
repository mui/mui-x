import * as React from 'react';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function FormPropsDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <NextDatePicker label="disabled" disabled />
        <NextDatePicker label="readOnly" readOnly />
      </Stack>
    </LocalizationProvider>
  );
}
