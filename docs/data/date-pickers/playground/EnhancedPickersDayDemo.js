import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { getEnhancedCustomTheme } from './getEnhancedCustomTheme';

export default function EnhancedPickersDayDemo() {
  const theme = createTheme(getEnhancedCustomTheme('light'));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <StaticDateRangePicker
          slotProps={{
            actionBar: {
              actions: ['accept', 'cancel'],
            },
          }}
          enableEnhancedDaySlot
        />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StaticDateRangePicker
            slotProps={{
              actionBar: {
                actions: ['accept', 'cancel'],
              },
            }}
            enableEnhancedDaySlot
          />
        </ThemeProvider>
      </Box>
    </LocalizationProvider>
  );
}
