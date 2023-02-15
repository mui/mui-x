import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DateRange } from '@mui/x-date-pickers-pro';

export default function LifeCycleDateRangeField() {
  const [value, setValue] = React.useState<DateRange<Dayjs | null>>([
    dayjs('2022-04-07'),
    null,
  ]);

  return (
    <Stack spacing={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SingleInputDateRangeField
          value={value}
          onChange={(newValue) => setValue(newValue)}
          sx={{ width: 300 }}
        />
      </LocalizationProvider>
      <Typography>
        Value:{' '}
        {value.map((date) => (date == null ? 'null' : date.format('L'))).join(' – ')}
      </Typography>
    </Stack>
  );
}
