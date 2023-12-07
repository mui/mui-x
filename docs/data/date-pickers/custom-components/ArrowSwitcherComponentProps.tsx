import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimeClock, TimeClockSlotProps } from '@mui/x-date-pickers/TimeClock';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

const slotProps: TimeClockSlotProps = {
  leftArrowIcon: { fontSize: 'large' },
  rightArrowIcon: { fontSize: 'large' },
  previousIconButton: {
    size: 'medium',
  },
  nextIconButton: {
    size: 'medium',
  },
};

type CurrentComponent = 'date' | 'time' | 'dateRange';

export default function ArrowSwitcherComponentProps() {
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
          <ToggleButton value={'date'}>date</ToggleButton>
          <ToggleButton value={'time'}>time</ToggleButton>
          <ToggleButton value={'dateRange'}>date range</ToggleButton>
        </ToggleButtonGroup>
        {currentComponent === 'date' && (
          <DateCalendar defaultValue={dayjs('2022-04-17')} slotProps={slotProps} />
        )}
        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <TimeClock
              defaultValue={dayjs('2022-04-17T15:30')}
              slotProps={slotProps}
              showViewSwitcher
            />
          </Box>
        )}
        {currentComponent === 'dateRange' && (
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
            slotProps={slotProps}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}
