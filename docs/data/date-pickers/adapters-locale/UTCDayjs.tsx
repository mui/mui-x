import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

dayjs.extend(utc);

export default function UTCDayjs() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs.utc}>
      <Stack spacing={2}>
        <DateTimePicker value={value} onChange={(newValue) => setValue(newValue)} />
        <Typography>Value: {value == null ? 'null' : value.format()}</Typography>
      </Stack>
    </LocalizationProvider>
  );
}
