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
          '& .MuiDayCalendar-root': { background: deepPurple[100] },
          '& .MuiDayCalendar-weekDayLabel': {
            color: deepPurple[700],
            fontWeight: 700,
          },
          '& .MuiDayCalendar-weekContainer': {
            backgroundColor: deepPurple[50],
            borderRadius: 12,
          },
          '& .MuiDayCalendar-weekNumberLabel': {
            border: `1px solid red`,
            color: deepPurple[700],
            fontWeight: 700,
          },
          '& .MuiDayCalendar-weekNumber': {
            color: deepPurple[700],
            fontWeight: 700,
          },
        }}
        slotProps={{
          day: {
            sx: {
              borderRadius: 2,
              '&.MuiPickersDay-today:not(.Mui-selected)': {
                borderColor: deepPurple[700],
                color: deepPurple[700],
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
