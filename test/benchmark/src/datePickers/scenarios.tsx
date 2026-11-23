import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { defineScenario } from '../utils/scenario';

// Fixed dates, so every sample renders the same days.
const day = dayjs('2025-07-15');
const range: [dayjs.Dayjs, dayjs.Dayjs] = [dayjs('2025-07-10'), dayjs('2025-08-05')];

export const dateCalendar = defineScenario('DateCalendar', () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateCalendar defaultValue={day} referenceDate={day} />
  </LocalizationProvider>
));

export const dateRangeCalendar = defineScenario('DateRangeCalendar with 2 months', () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateRangeCalendar defaultValue={range} referenceDate={range[0]} calendars={2} />
  </LocalizationProvider>
));
