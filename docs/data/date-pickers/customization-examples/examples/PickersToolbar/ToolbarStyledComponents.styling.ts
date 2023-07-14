import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { styled } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const StyledStaticDatedPicker = styled(StaticDatePicker)(({ theme }) => ({
  '& .MuiPickersToolbar-root': {
    background: deepPurple[200],
    borderRadius: 4,
    '& > *': {
      fontFamily: 'Arial',
      color: deepPurple[600],
    },
    '& .MuiPickersToolbar-content > *': {
      ...theme.typography.h2,
      color: deepPurple[900],
      fontSize: '2.4rem',
    },
  },
}));

export default StyledStaticDatedPicker;
