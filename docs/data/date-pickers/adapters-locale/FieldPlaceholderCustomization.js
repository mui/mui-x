import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function FieldPlaceholderCustomization() {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={{
        fieldMonthPlaceholder: () => 'MMM',
      }}
    >
      <DateField format="DD MMM YYYY" />
    </LocalizationProvider>
  );
}
