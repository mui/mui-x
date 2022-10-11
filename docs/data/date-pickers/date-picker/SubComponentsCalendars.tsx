import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';

const minDate = dayjs('2020-01-01T00:00:00.000');
const maxDate = dayjs('2034-01-01T00:00:00.000');

export default function SubComponentsCalendars() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MonthCalendar
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newValue) => setValue(newValue)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <YearCalendar
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
