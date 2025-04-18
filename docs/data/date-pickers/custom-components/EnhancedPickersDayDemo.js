import * as React from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { getEnhancedCustomTheme } from './getEnhancedCustomTheme';

export default function EnhancedPickersDayDemo() {
  const currentTheme = useTheme();
  const theme = createTheme(getEnhancedCustomTheme(currentTheme.palette.mode));
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
