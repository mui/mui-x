import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

export default function BasicDateField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateField label="Basic date field" />
    </LocalizationProvider>
  );
}
