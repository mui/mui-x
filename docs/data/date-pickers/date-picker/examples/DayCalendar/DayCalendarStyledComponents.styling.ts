import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { styled } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const StyledStaticDatedPicker = styled(StaticDatePicker)(() => ({
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

export default StyledStaticDatedPicker;
