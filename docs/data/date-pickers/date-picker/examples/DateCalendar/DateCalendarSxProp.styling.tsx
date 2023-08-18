import * as React from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { deepPurple } from '@mui/material/colors';

export default function CustomDesktopDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        sx={{
          height: 'fit-content',
          width: 'fit-content',
          maxHeight: '400px',
          backgroundColor: deepPurple[50],
          padding: 1,
          '& *': { fontFamily: 'monospace' },
          '& .MuiDateCalendar-root': {
            padding: 1,
            backgroundColor: deepPurple[100],
          },
        }}
      />
    </LocalizationProvider>
  );
}
