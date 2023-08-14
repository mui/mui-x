import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function BasicTimezoneProp() {
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs.utc('2022-04-17T15:30'),
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <TimePicker
          value={value}
          onChange={setValue}
          timezone="America/New_York"
          label={'Rendered in "America/New_York"'}
        />
        <TimePicker
          value={value}
          onChange={setValue}
          timezone="Europe/Paris"
          label={'Rendered in "Europe/Paris"'}
        />
        <Typography>
          Stored value: {value == null ? 'null' : value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
