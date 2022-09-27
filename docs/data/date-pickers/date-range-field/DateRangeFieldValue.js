import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function DateRangeFieldValue() {
  const [value, setValue] = React.useState(() => [
    dayjs('2022-04-07'),
    dayjs('2022-04-13'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} direction="row">
        <SingleInputDateRangeField
          label="Uncontrolled field"
          defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-13')]}
        />
        <SingleInputDateRangeField
          label="Controlled field"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </Stack>
    </LocalizationProvider>
  );
}
