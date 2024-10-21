import * as React from 'react';
import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function LuxonTimezone() {
  const [value, setValue] = React.useState<DateTime<true> | DateTime<false> | null>(
    DateTime.fromISO('2022-04-17T15:30', { zone: 'America/New_York' }),
  );

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Stack spacing={2}>
        <DateTimePicker value={value} onChange={setValue} />
        <Typography>
          Stored value: {value == null ? 'null' : value.toISO()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
