import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const StyledDesktopDatePicker = styled(DesktopDatePicker)(() => ({
  '& .MuiDayCalendar-root': {
    background: deepPurple[50],
    '& *': { fontFamily: 'monospace' },
  },
  '& .MuiDayCalendar-weekDayLabel': {
    color: deepPurple[700],
    fontWeight: 700,
  },
  '& .MuiDayCalendar-weekContainer': {
    backgroundColor: deepPurple[100],
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
  '& .MuiPickersDay-root': {
    borderRadius: 2,
  },
  '& .MuiPickersDay-today': {
    '&:not(.Mui-selected)': { borderColor: deepPurple[700], color: deepPurple[700] },
  },
}));

/* You will need to use the `disablePortal` prop from the popper 
in order to be able to use styled components with the DesktopDatePicker */
export default function CustomDesktopDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDesktopDatePicker slotProps={{ popper: { disablePortal: true } }} />
    </LocalizationProvider>
  );
}
