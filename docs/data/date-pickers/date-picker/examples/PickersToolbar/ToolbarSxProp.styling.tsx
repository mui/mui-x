import * as React from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { deepPurple } from '@mui/material/colors';

export default function CustomDesktopDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        slotProps={{
          toolbar: {
            sx: {
              background: deepPurple[200],
              borderRadius: 4,
              '& > *': {
                fontFamily: 'Arial',
                color: deepPurple[600],
              },
              '& .MuiPickersToolbar-content >  *': {
                color: deepPurple[900],
                fontSize: '2.4rem',
                fontWeight: 200,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
