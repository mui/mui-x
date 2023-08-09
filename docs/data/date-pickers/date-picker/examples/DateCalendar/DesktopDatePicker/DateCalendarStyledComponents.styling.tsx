import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';

const StyledDesktopDatePicker = styled(DesktopDatePicker)(() => ({
  '& .MuiDateCalendar-root': {
    height: 'fit-content',
    maxHeight: '400px',
    '& *': { fontFamily: 'Arial' },
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
