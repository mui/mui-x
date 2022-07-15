import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';

export default function CustomInputDateField() {
  const [value, setValue] = React.useState<Date | null>(new Date());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2}>
        <DateField
          label="Custom format"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          format="dd MMMM yyyy"
        />
      </Stack>
    </LocalizationProvider>
  );
}
