import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomFieldFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DateField
          label="Date Field"
          format="MM - DD - YYYY"
          defaultValue={dayjs('2022-04-17')}
        />
        <DatePicker
          label="Date Picker"
          format="YYYY/MM/DD"
          defaultValue={dayjs('2022-04-17')}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
