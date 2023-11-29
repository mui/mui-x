import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function FieldPlaceholderCustomization() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        format="DD MMM YYYY"
        localeText={{
          // Define it on the `LocalizationProvider` if you want to change this translation globally
          fieldMonthPlaceholder: (params) =>
            params.contentType === 'digit' ? 'MM' : params.format,
        }}
      />
    </LocalizationProvider>
  );
}
