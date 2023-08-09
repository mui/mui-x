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
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          height: 'fit-content',
          maxHeight: '400px',
          '& *': { fontFamily: 'Arial' },
        },
      },
    },
  },
});

export default newTheme;
