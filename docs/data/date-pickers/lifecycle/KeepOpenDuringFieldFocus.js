import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function KeepOpenDuringFieldFocus() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <div>
          <Typography variant="body2" gutterBottom>
            Default behavior (closes on click/focus)
          </Typography>
          <DatePicker />
        </div>
        <div>
          <Typography variant="body2" gutterBottom>
            With <code>keepOpenDuringFieldFocus</code>
          </Typography>
          <DatePicker keepOpenDuringFieldFocus />
        </div>
      </Stack>
    </LocalizationProvider>
  );
}
