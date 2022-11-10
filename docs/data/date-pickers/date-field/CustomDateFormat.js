import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';

export default function CustomDateFormat() {
  const [value, setValue] = React.useState(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={(theme) => ({ width: theme.spacing(48) })}>
        <DateField
          label="Dash separator"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="DD-MM-YYYY"
        />
        <DateField
          label="Dash and white space separator"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="DD / MM / YYYY"
        />
        <DateField
          label="Full letter month"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="DD MMMM YYYY"
        />
        <DateField
          label="Date and time format"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="L LT"
        />
        <DateField
          label="Time format"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="LT"
        />
      </Stack>
    </LocalizationProvider>
  );
}
