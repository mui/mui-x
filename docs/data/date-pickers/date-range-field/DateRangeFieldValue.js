import * as React from 'react';
import addWeeks from 'date-fns/addWeeks';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function DateFieldValue() {
  const [value, setValue] = React.useState(() => [
    new Date(),
    addWeeks(new Date(), 1),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2} direction="row">
        <SingleInputDateRangeField
          label="Uncontrolled field"
          defaultValue={[new Date(), addWeeks(new Date(), 1)]}
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
