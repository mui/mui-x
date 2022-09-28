import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { MonthPicker } from '@mui/x-date-pickers/MonthPicker';
import { YearPicker } from '@mui/x-date-pickers/YearPicker';

const minDate = dayjs('2020-01-01T00:00:00.000');
const maxDate = dayjs('2034-01-01T00:00:00.000');

export default function SubComponentsPickers() {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CalendarPicker date={date} onChange={(newDate) => setDate(newDate)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MonthPicker
            date={date}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newDate) => setDate(newDate)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <YearPicker
            date={date}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newDate) => setDate(newDate)}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
