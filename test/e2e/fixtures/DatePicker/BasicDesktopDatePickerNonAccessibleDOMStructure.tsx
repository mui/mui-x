import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function BasicDesktopDatePickerNonAccessibleDOMStructure() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label="Desktop Date Picker"
        className="test-date-picker"
        slotProps={{ field: { clearable: true } }}
        enableAccessibleFieldDOMStructure={false}
      />
    </LocalizationProvider>
  );
}
