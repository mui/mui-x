import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { getEnhancedCustomTheme } from './getEnhancedCustomTheme';

export default function EnhancedPickersDayDemo() {
  const theme = createTheme(getEnhancedCustomTheme('light'));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
      </Stack>
    </LocalizationProvider>
  );
}
