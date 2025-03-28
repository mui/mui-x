import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function BasicDateTimeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimeField']}>
        <DateTimeField label="Basic date time field" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
