import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';

const components = {
  LeftArrowIcon: ArrowLeft,
  RightArrowIcon: ArrowRight,
};

export default function ArrowSwitcherComponent() {
  const [date, setDate] = React.useState(() => dayjs());
  const [time, setTime] = React.useState(() => dayjs());
  const [dateRange, setDateRange] = React.useState(() => [
    dayjs(),
    dayjs().add(3, 'day'),
  ]);

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
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            onChange={(newValue) => setDate(newValue)}
            value={date}
            renderInput={(params) => <TextField {...params} />}
            components={components}
          />
        )}

        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <StaticTimePicker
              displayStaticWrapperAs="desktop"
              onChange={(newValue) => setTime(newValue)}
              value={time}
              renderInput={(params) => <TextField {...params} />}
              components={components}
            />
          </Box>
        )}

        {currentComponent === 'dateRange' && (
          <StaticDateRangePicker
            displayStaticWrapperAs="desktop"
            onChange={(newValue) => setDateRange(newValue)}
            value={dateRange}
            renderInput={(params) => <TextField {...params} />}
            components={components}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}
