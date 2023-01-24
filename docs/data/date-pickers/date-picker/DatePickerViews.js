import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function DatePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['NextDatePicker', 'NextDatePicker', 'NextDatePicker']}
      >
        <NextDatePicker
          label={'"year", "month" and "day"'}
          views={['year', 'month', 'day']}
        />
        <NextDatePicker label={'"day"'} views={['day']} />
        <NextDatePicker label={'"month" and "year"'} views={['month', 'year']} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
