import * as React from 'react';
import moment, { Moment } from 'moment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function UTCMoment() {
  const [value, setValue] = React.useState<Moment | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} dateLibInstance={moment.utc}>
      <Stack spacing={2}>
        <DateTimePicker value={value} onChange={(newValue) => setValue(newValue)} />
        <Typography>Value: {value == null ? 'null' : value.format()}</Typography>
      </Stack>
    </LocalizationProvider>
  );
}
