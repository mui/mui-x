import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

const componentsProps = {
  leftArrowIcon: { fontSize: 'large' },
  rightArrowIcon: { fontSize: 'large' },
  previousIconButton: {
    size: 'medium',
  },
  nextIconButton: {
    size: 'medium',
  },
};

export default function ArrowSwitcherComponentProps() {
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
          <ToggleButton value={'date'}>date picker</ToggleButton>
          <ToggleButton value={'time'}>time picker</ToggleButton>
          <ToggleButton value={'dateRange'}>date range picker</ToggleButton>
        </ToggleButtonGroup>
        {currentComponent === 'date' && (
          <DateCalendar
            defaultValue={dayjs('2022-04-07')}
            componentsProps={componentsProps}
          />
        )}

        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <TimeClock
              defaultValue={dayjs('2022-04-07T15:30')}
              componentsProps={componentsProps}
              showViewSwitcher
            />
          </Box>
        )}

        {currentComponent === 'dateRange' && (
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
            componentsProps={componentsProps}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}
