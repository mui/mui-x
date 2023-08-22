import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function ReferenceDateExplicitDateTimePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <DateTimePicker
          value={value}
          onChange={setValue}
          referenceDate={dayjs('2022-04-17T15:30')}
        />
        <Typography>
          Stored value: {value == null ? 'null' : value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
