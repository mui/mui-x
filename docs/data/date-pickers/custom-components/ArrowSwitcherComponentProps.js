import * as React from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker, StaticTimePicker } from '@mui/x-date-pickers';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';

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
            componentsProps={componentsProps}
          />
        )}

        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <StaticTimePicker
              displayStaticWrapperAs="desktop"
              onChange={(newValue) => setTime(newValue)}
              value={time}
              renderInput={(params) => <TextField {...params} />}
              componentsProps={componentsProps}
            />
          </Box>
        )}

        {currentComponent === 'dateRange' && (
          <StaticDateRangePicker
            displayStaticWrapperAs="desktop"
            onChange={(newValue) => setDateRange(newValue)}
            value={dateRange}
            renderInput={(params) => <TextField {...params} />}
            componentsProps={componentsProps}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}
