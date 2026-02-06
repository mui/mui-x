import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function FocusedSectionOnFocus() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: '300px' }}>
        <DateField label="Focuses 'day' section" focusedSectionOnFocus="day" />
        <DatePicker label="Focuses 'year' section" focusedSectionOnFocus="year" />
      </Stack>
    </LocalizationProvider>
  );
}
