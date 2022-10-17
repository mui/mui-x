import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import AlarmIcon from '@mui/icons-material/Alarm';
import SnoozeIcon from '@mui/icons-material/Snooze';
import TextField from '@mui/material/TextField';
import ClockIcon from '@mui/icons-material/AccessTime';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import Stack from '@mui/material/Stack';

export default function CustomDateTimePicker() {
  const [dateWithNoInitialValue, setDateWithNoInitialValue] =
    React.useState<Dayjs | null>(null);
  const [dateWithInitialValue, setDateWithInitialValue] =
    React.useState<Dayjs | null>(dayjs('2019-01-01T18:54'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DateTimePicker
          openTo="hours"
          value={dateWithInitialValue}
          onChange={(newValue) => {
            setDateWithInitialValue(newValue);
          }}
          components={{
            LeftArrowIcon: AlarmIcon,
            RightArrowIcon: SnoozeIcon,
            OpenPickerIcon: ClockIcon,
          }}
          renderInput={(params) => (
            <TextField {...params} helperText="Hardcoded helper text" />
          )}
        />
        <MobileDateTimePicker
          value={dateWithInitialValue}
          onChange={(newValue) => {
            setDateWithInitialValue(newValue);
          }}
          label="With error handler"
          onError={console.log}
          inputFormat="YYYY/MM/DD hh:mm a"
          mask="____/__/__ __:__ _M"
          renderInput={(params) => <TextField {...params} />}
        />
        <DateTimePicker
          value={dateWithNoInitialValue}
          onChange={(newValue) => setDateWithNoInitialValue(newValue)}
          renderInput={(params) => (
            <TextField {...params} helperText="Clear Initial State" />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
}
