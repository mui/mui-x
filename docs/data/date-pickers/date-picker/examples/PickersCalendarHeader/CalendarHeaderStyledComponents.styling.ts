import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { styled } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const StyledStaticDatePicker = styled(StaticDatePicker)(() => ({
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

export default StyledStaticDatePicker;
