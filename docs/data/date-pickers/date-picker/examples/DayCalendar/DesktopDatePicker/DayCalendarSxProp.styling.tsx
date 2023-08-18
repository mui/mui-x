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
          desktopPaper: {
            sx: {
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
            },
          },
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
