import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlightPicker from './FlightPicker';
import ThemeToggleGroup from './ThemeToggleGroup';
import Clock from './Clock';
import Birthday from './Birthday';
import DigitalClock from './DigitalClock';
import DateRangeWithShortcuts from './DateRangeWithShortcuts';
import PickerButton from './PickerButton';

export default function MainDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack sx={{ p: 1, width: '100%' }} direction="row" spacing={1}>
        <Stack spacing={1} className="left-panel" sx={{ flexGrow: 1 }}>
          <Stack spacing={1} direction="row" sx={{ height: 'fit-content' }}>
            <ThemeToggleGroup />
            <FlightPicker />
          </Stack>
          <Stack spacing={1} direction="row" sx={{ flexGrow: 1 }}>
            <DateRangeWithShortcuts />
            <Stack spacing={1}>
              <DigitalClock />
              <PickerButton />
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={1} className="right-panel" sx={{ flexGrow: 1 }}>
          <Clock />
          <Birthday />
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
