import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

// Create rtl cache
const cacheRtl = createCache({
  key: 'pickers-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function PickersRTL() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();

  const theme = React.useMemo(
    () =>
      createTheme({}, existingTheme, {
        direction: 'rtl',
      }),
    [existingTheme],
  );

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={[
                'DatePicker',
                'DateRangeCalendar',
                'MultiSectionDigitalClock',
              ]}
            >
              <DatePicker
                // Setting `dir="rtl"` on the paper is needed if the `<div dir="rtl />` does not contain the portaled element.
                // If you set `dir="rtl"` on the `<body />`, you can skip it.
                slotProps={{
                  desktopPaper: {
                    dir: 'rtl',
                  },
                  mobilePaper: {
                    dir: 'rtl',
                  },
                }}
              />
              <DateRangeCalendar />
              <Box sx={{ width: 56 * 3 }}>
                <MultiSectionDigitalClock />
              </Box>
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
