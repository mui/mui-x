import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { deepPurple } from '@mui/material/colors';

export default function CustomDesktopDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        slotProps={{
          calendarHeader: {
            sx: {
              background: deepPurple[50],
              '& .MuiPickersCalendarHeader-label': {
                color: deepPurple[900],
                fontWeight: 700,
              },
              '& .MuiPickersCalendarHeader-labelContainer': {
                border: `1px solid ${deepPurple[700]}`,
                padding: 0.5,
              },
            },
          },
          switchViewButton: {
            sx: {
              backgroundColor: deepPurple[500],
              '&:hover': { backgroundColor: deepPurple[600] },
            },
          },
          switchViewIcon: {
            sx: {
              color: 'white',
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
