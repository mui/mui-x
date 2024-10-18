import * as React from 'react';
import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { SimpleValue } from '@mui/x-date-pickers/models';

export default function LuxonUTC() {
  const [value, setValue] = React.useState<SimpleValue>(
    DateTime.fromISO('2022-04-17T15:30', { zone: 'UTC' }),
  );

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Stack spacing={2}>
        <DateTimePicker value={value} onChange={setValue} />
        <Typography>
          Stored value: {value == null ? 'null' : (value as DateTime).toISO()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
