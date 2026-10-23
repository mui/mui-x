import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Page for `.github/nvda/fields.pw.mjs`.
export default function NvdaFieldWithHelperText() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <button type="button">Before</button>
      <DatePicker
        slotProps={{
          textField: { variant: 'standard', label: 'Start date', helperText: 'Pick any weekday' },
        }}
      />
      <button type="button">After</button>
      {/* Keeps the body click done by Guidepup's `navigateToWebContent()` away from the field. */}
      <div style={{ height: '100vh' }} />
    </LocalizationProvider>
  );
}
