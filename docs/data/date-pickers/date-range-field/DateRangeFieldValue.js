import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

const today = dayjs();

export default function DateRangeFieldValue() {
  const [value, setValue] = React.useState(() => [today, today.add(1, 'week')]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} direction="row">
        <SingleInputDateRangeField
          label="Uncontrolled field"
          defaultValue={[today, today.add(1, 'week')]}
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
