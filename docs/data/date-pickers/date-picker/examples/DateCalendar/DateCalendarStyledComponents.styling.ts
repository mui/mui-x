import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { styled } from '@mui/material/styles';

const StyledStaticDatePicker = styled(StaticDatePicker)(() => ({
  '& .MuiDateCalendar-root': {
    height: 'fit-content',
    maxHeight: '400px',
    '& *': { fontFamily: 'Arial' },
  },
}));

export default StyledStaticDatePicker;
