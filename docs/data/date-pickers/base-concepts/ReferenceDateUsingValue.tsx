import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ReferenceDateUsingValue() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Date Picker" defaultValue={dayjs('2022-04-17')} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
