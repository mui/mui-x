import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlightPicker from './mainDemo/FlightPicker';
import ThemeToggleGroup from './mainDemo/ThemeToggleGroup';
import Clock from './mainDemo/Clock';
import Birthday from './mainDemo/Birthday';
import DigitalClock from './mainDemo/DigitalClock';
import DateRangeWithShortcuts from './mainDemo/DateRangeWithShortcuts';
import PickerButton from './mainDemo/PickerButton';

export default function MainDemo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.up('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack sx={{ p: 1, width: '100%' }} direction="row" spacing={1}>
        <Stack spacing={1} className="left-panel" sx={{ flexGrow: 1 }}>
          <Stack
            spacing={1}
            direction={isMobile ? 'column' : 'row'}
            sx={{ height: 'fit-content' }}
          >
            <ThemeToggleGroup />
            <FlightPicker />
          </Stack>
          <Stack spacing={1} direction="row" sx={{ flexGrow: 1 }}>
            <DateRangeWithShortcuts />
            {isTablet && (
              <Stack spacing={1}>
                <DigitalClock />
                <PickerButton />
              </Stack>
            )}
          </Stack>
        </Stack>
        {isDesktop && (
          <Stack spacing={1} className="right-panel" sx={{ flexGrow: 1 }}>
            <Clock />
            <Birthday />
          </Stack>
        )}
      </Stack>
    </LocalizationProvider>
  );
}
