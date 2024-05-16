import * as React from 'react';
import moment from 'moment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

moment.locale('en');

export default function MomentUTC() {
  const [value, setValue] = React.useState(moment.utc('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en">
      <Stack spacing={2}>
        <DateTimePicker value={value} onChange={setValue} />
        <Typography>
          Stored value: {value == null ? 'null' : value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
