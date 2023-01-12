import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

const defaultValue = dayjs('2022-04-07');

export default function FormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DateField label="disabled" defaultValue={defaultValue} disabled />
        <DateField label="readOnly" defaultValue={defaultValue} readOnly />
      </DemoContainer>
    </LocalizationProvider>
  );
}
