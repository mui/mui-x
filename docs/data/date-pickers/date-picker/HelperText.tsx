import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function HelperText() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextDatePicker
        label="Helper text example"
        slotProps={{
          textField: {
            helperText: 'MM / DD / YYYY',
          },
        }}
      />
    </LocalizationProvider>
  );
}
