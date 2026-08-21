import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function YearRangePicker() {
  const [startYear, setStartYear] = React.useState(dayjs('2021'));
  const [endYear, setEndYear] = React.useState(dayjs('2025'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker
          label="From"
          views={['year']}
          openTo="year"
          value={startYear}
          onChange={setStartYear}
          maxDate={endYear ?? undefined}
        />
        <DatePicker
          label="To"
          views={['year']}
          openTo="year"
          value={endYear}
          onChange={setEndYear}
          minDate={startYear ?? undefined}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
