import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const StyledDesktopDatePicker = styled(DesktopDatePicker)(() => ({
  '& .MuiPickersCalendarHeader-root': {
    background: deepPurple[50],
  },
  '& .MuiPickersCalendarHeader-label': {
    color: deepPurple[900],
    fontWeight: 700,
  },
  '& .MuiPickersCalendarHeader-labelContainer': {
    border: `1px solid ${deepPurple[700]}`,
    padding: 3,
  },
  '& .MuiPickersCalendarHeader-switchViewButton': {
    backgroundColor: deepPurple[500],
    '&:hover': { backgroundColor: deepPurple[600] },
  },
  '& .MuiPickersCalendarHeader-switchViewIcon': {
    color: 'white',
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
