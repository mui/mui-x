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
import { TimeClock, TimeClockSlotsComponent } from '@mui/x-date-pickers/TimeClock';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

const components: TimeClockSlotsComponent = {
  LeftArrowIcon: ArrowLeft,
  RightArrowIcon: ArrowRight,
};

type CurrentComponent = 'date' | 'time' | 'dateRange';

export default function ArrowSwitcherComponent() {
  const [currentComponent, setCurrentComponent] =
    React.useState<CurrentComponent>('date');

  const handleCurrentComponentChange = (
    event: React.MouseEvent<HTMLElement>,
    nextCurrentComponent: CurrentComponent | null,
  ) => {
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
          <ToggleButton value={'date'}>date picker</ToggleButton>
          <ToggleButton value={'time'}>time picker</ToggleButton>
          <ToggleButton value={'dateRange'}>date range picker</ToggleButton>
        </ToggleButtonGroup>
        {currentComponent === 'date' && (
          <DateCalendar defaultValue={dayjs('2022-04-07')} components={components} />
        )}
        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <TimeClock
              defaultValue={dayjs('2022-04-07T15:30')}
              components={components}
              showViewSwitcher
            />
          </Box>
        )}
        {currentComponent === 'dateRange' && (
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
            components={components}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}
