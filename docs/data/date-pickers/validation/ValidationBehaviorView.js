import * as React from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

export default function ValidationBehaviorView() {
  const [datePickerValue, setDatePickerValue] = React.useState(null);
  const [timePickerValue, setTimePickerValue] = React.useState(
    dayjs().set('hour', 14).startOf('hour'),
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid
        container
        columns={{ xs: 1, lg: 2 }}
        spacing={4}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <StaticDatePicker
            disableFuture
            value={datePickerValue}
            views={['day']}
            onChange={(newValue) => setDatePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            showToolbar={false}
            components={{ ActionBar: () => null }}
          />
        </Grid>
        <Grid item>
          <StaticTimePicker
            maxTime={dayjs().set('hour', 15).startOf('hour')}
            value={timePickerValue}
            onChange={(newValue) => setTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            showToolbar={false}
            components={{ ActionBar: () => null }}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
