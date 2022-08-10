import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';

export default function CustomDateFormat() {
  const [value, setValue] = React.useState(new Date());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2} sx={(theme) => ({ width: theme.spacing(48) })}>
        <DateField
          label="Dash separator"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="dd-MM-yyyy"
        />
        <DateField
          label="Dash and white space separator"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="dd / MM / yyyy"
        />
        <DateField
          label="Full letter month"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="dd MMMM yyyy"
        />
        <DateField
          label="Date and time format"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="Pp"
        />
        <DateField
          label="Time format"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="p"
        />
      </Stack>
    </LocalizationProvider>
  );
}
