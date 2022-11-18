import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePickerProps,
  StaticDatePicker,
  StaticTimePicker,
} from '@mui/x-date-pickers';
import { DateRange, StaticDateRangePicker } from '@mui/x-date-pickers-pro';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';

const componentsProps: DatePickerProps<any>['componentsProps'] = {
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
  const [date, setDate] = React.useState<Dayjs | null>(() => dayjs());
  const [time, setTime] = React.useState<Dayjs | null>(() => dayjs());
  const [dateRange, setDateRange] = React.useState<DateRange<Dayjs>>(() => [
    dayjs(),
    dayjs().add(3, 'day'),
  ]);
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
