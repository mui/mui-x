import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function TimeValidationTimePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2020-01-01 12:00'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <TimePicker
          renderInput={(params) => <TextField {...params} />}
          value={value}
          label="min/max time"
          onChange={(newValue) => {
            setValue(newValue);
          }}
          minTime={dayjs('2018-01-01T08:00')}
          maxTime={dayjs('2018-01-01T18:45')}
        />
        <TimePicker
          renderInput={(params) => <TextField {...params} />}
          label="Disable odd hours"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          shouldDisableTime={(timeValue, clockType) => {
            if (clockType === 'hours' && timeValue % 2) {
              return true;
            }

            return false;
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
}
