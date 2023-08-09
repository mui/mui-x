import { deepPurple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

const newTheme = createTheme({
  palette: {
    primary: {
      main: deepPurple[500],
      dark: deepPurple[900],
      light: deepPurple[200],
    },
  },
  components: {
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: { color: deepPurple[700], fontWeight: 700 },
        weekContainer: {
          backgroundColor: deepPurple[50],
          borderRadius: 12,
        },
        weekNumberLabel: {
          border: `1px solid red`,
          color: deepPurple[700],
          fontWeight: 700,
        },
        weekNumber: { color: deepPurple[700], fontWeight: 700 },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: { borderRadius: 2 },
        today: {
          '&:not(.Mui-selected)': {
            borderColor: deepPurple[700],
            color: deepPurple[700],
          },
        },
      },
    },
  },
});

export default newTheme;
