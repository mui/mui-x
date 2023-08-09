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
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          background: deepPurple[50],
        },
        label: { color: deepPurple[900], fontWeight: 700 },
        labelContainer: { border: `1px solid ${deepPurple[700]}`, padding: 3 },
        switchViewButton: {
          backgroundColor: deepPurple[500],
          '&:hover': { backgroundColor: deepPurple[600] },
        },
        switchViewIcon: {
          color: 'white',
        },
      },
    },
  },
});

export default newTheme;
