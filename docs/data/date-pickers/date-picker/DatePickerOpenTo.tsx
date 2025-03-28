import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '../_shared/DemoContainer';

export default function DatePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker label={'"year"'} openTo="year" />
        <DatePicker
          label={'"month"'}
          openTo="month"
          views={['year', 'month', 'day']}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
