import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function BasicDesktopDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        enableAccessibleFieldDOMStructure
        label="Desktop Date Picker"
        className="test-date-picker"
        slotProps={{ field: { clearable: true } }}
      />
    </LocalizationProvider>
  );
}
