import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const currentYear = dayjs();

export default function DatePickerYearsOrder() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Years in descending order"
        maxDate={currentYear}
        openTo="year"
        views={['year', 'month']}
        yearsOrder="desc"
        sx={{ minWidth: 250 }}
      />
    </LocalizationProvider>
  );
}
