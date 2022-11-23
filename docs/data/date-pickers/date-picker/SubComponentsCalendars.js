import * as React from 'react';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';

export default function SubComponentsCalendars() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MonthCalendar defaultValue={dayjs('2022-04-07')} />
        </Grid>
        <Grid item xs={12} md={6}>
          <YearCalendar defaultValue={dayjs('2022-04-07')} />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
