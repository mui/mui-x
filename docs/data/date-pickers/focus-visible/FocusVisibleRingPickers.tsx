import * as React from 'react';
import dayjs from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-mui-color-scheme' },
  colorSchemes: { light: true, dark: true },
  focusVisible: {
    outlineWidth: 2,
    outlineOffset: 1,
    boxShadow: '0 0 0 1px var(--mui-palette-background-paper)',
    insetOverrides: {
      boxShadow: 'inset 0 0 0 3px var(--mui-palette-background-paper)',
    },
  },
  components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
});

export default function FocusVisibleRingPickers() {
  const value = dayjs().date(15).startOf('day');

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <DatePicker label="Date" defaultValue={value} />
          <DateCalendar defaultValue={value} sx={{ m: 0 }} />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
