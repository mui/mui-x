import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

const slots = {
  leftArrowIcon: ArrowLeft,
  rightArrowIcon: ArrowRight,
};

export default function ArrowSwitcherComponent() {
  const [currentComponent, setCurrentComponent] = React.useState('date');

  const handleCurrentComponentChange = (event, nextCurrentComponent) => {
    if (nextCurrentComponent !== null) {
      setCurrentComponent(nextCurrentComponent);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: '100%' }} alignItems="center">
        <ToggleButtonGroup
          fullWidth
          color="primary"
          value={currentComponent}
          onChange={handleCurrentComponentChange}
          exclusive
        >
          <ToggleButton value={'date'}>date</ToggleButton>
          <ToggleButton value={'time'}>time</ToggleButton>
          <ToggleButton value={'dateRange'}>date range</ToggleButton>
        </ToggleButtonGroup>
        {currentComponent === 'date' && (
          <DateCalendar defaultValue={dayjs('2022-04-17')} slots={slots} />
        )}
        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <TimeClock
              defaultValue={dayjs('2022-04-17T15:30')}
              slots={slots}
              showViewSwitcher
            />
          </Box>
        )}
        {currentComponent === 'dateRange' && (
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
            slots={slots}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}
