import * as React from 'react';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

export default function FormPropsDateTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <NextDateTimePicker label="disabled" disabled />
        <NextDateTimePicker label="readOnly" readOnly />
      </Stack>
    </LocalizationProvider>
  );
}
