import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function DatePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['NextDatePicker', 'NextDatePicker']}>
        <NextDatePicker label={'"year"'} openTo="year" />
        <NextDatePicker
          label={'"month"'}
          openTo="month"
          views={['year', 'month', 'day']}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
