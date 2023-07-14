import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { styled } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const StyledStaticDatedPicker = styled(StaticDatePicker)(() => ({
  '& .MuiDateCalendar-root': {
    '& *': { fontFamily: 'Arial' },
    '& .MuiPickersDay-root': {
      '&.MuiButtonBase-root': { borderRadius: 2 },
      '&.Mui-selected': { background: deepPurple[900] },
    },
  },
}));

export default StyledStaticDatedPicker;
