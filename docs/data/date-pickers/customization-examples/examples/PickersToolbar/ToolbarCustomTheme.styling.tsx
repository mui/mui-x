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
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          background: deepPurple[200],
          borderRadius: 4,
          '& > *': {
            fontFamily: 'Arial',
            color: deepPurple[600],
          },
        },
        content: {
          '& > *': {
            color: deepPurple[900],
            fontSize: '2.4rem',
            fontWeight: 200,
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
