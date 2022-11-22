import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} locale="fr">
        test
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
