import * as React from 'react';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { MonthPicker } from '@mui/x-date-pickers/MonthPicker';
import { YearPicker } from '@mui/x-date-pickers/YearPicker';

const minDate = dayjs('2020-01-01T00:00:00.000');
const maxDate = dayjs('2034-01-01T00:00:00.000');

export default function SubComponentsPickers() {
  const [value, setValue] = React.useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CalendarPicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MonthPicker
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newValue) => setValue(newValue)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <YearPicker
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newValue) => setValue(newValue)}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
