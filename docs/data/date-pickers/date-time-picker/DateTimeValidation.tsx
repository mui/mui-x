import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Stack from '@mui/material/Stack';

export default function DateTimeValidation() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DateTimePicker
          renderInput={(params) => <TextField {...params} />}
          label="Ignore date and time"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          minDateTime={dayjs('2022-04-02T12:00')}
        />
        <DateTimePicker
          renderInput={(params) => <TextField {...params} />}
          label="Ignore time in each day"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          minDate={dayjs('2022-02-14')}
          minTime={dayjs('2022-02-14T08:00')}
          maxTime={dayjs('2022-02-14T18:45')}
        />
      </Stack>
    </LocalizationProvider>
  );
}
