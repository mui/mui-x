import * as React from 'react';
import { DateTime, Settings } from 'luxon';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

Settings.defaultZone = 'UTC';

export default function LuxonUTC() {
  const [value, setValue] = React.useState<DateTime | null>(
    DateTime.fromISO('2022-04-17T15:30'),
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
