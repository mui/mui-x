import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function ReferenceDateExplicitTimePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <TimePicker
          value={value}
          onChange={setValue}
          referenceDate={dayjs('2022-04-17')}
        />
        <Typography>
          Stored value: {value == null ? 'null' : value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
