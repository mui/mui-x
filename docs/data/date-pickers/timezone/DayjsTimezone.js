import * as React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function DayjsTimezone() {
  const [value, setValue] = React.useState(
    dayjs.tz('2022-04-17T15:30', 'America/New_York'),
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <DateTimePicker value={value} onChange={setValue} />
        <Typography>
          Stored value: {value == null ? 'null' : value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
