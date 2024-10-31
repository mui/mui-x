import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PickersTimezone } from '@mui/x-date-pickers/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const TIMEZONES: PickersTimezone[] = ['default', 'system', 'UTC', 'America/Chicago'];

export default function TimezonePlayground() {
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs.utc('2022-04-17T15:30'),
  );

  const [currentTimezone, setCurrentTimezone] = React.useState<string>('UTC');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <ToggleButtonGroup
          value={currentTimezone}
          exclusive
          fullWidth
          onChange={(event, newTimezone) => {
            if (newTimezone != null) {
              setCurrentTimezone(newTimezone);
            }
          }}
        >
          {TIMEZONES.map((timezoneName) => (
            <ToggleButton key={timezoneName} value={timezoneName}>
              {timezoneName}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <DateTimePicker
          timezone={currentTimezone}
          value={value}
          onChange={setValue}
        />
        <Typography>
          Stored value: {value == null ? 'null' : value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
