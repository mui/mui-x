import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';

export default function CustomDateFormat() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={(theme) => ({ width: theme.spacing(48) })}>
        <DateField
          label="Dash separator"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="MM-DD-YYYY"
        />
        <DateField
          label="Full letter month"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="LL"
        />
      </Stack>
    </LocalizationProvider>
  );
}
