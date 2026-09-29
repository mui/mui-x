import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';

export default function FocusVisiblePickers() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () =>
      createTheme(
        {
          focusVisible: true,
          components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
        },
        existingTheme,
      ),
    [existingTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <DateCalendar />
          <DigitalClock timeStep={60} sx={{ maxHeight: 290, width: 170 }} />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
