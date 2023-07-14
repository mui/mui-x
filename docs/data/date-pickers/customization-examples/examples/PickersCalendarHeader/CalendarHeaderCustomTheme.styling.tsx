import * as React from 'react';
import { deepPurple } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
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
      styleOverrides: { root: { '& *': { fontFamily: 'Arial' } } },
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

export default function StyledStaticDatedPicker() {
  return (
    <ThemeProvider theme={newTheme}>
      <StaticDatePicker />
    </ThemeProvider>
  );
}
