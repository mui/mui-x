import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DesktopPickerFocusManagement() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <input aria-label="decoy" />
      <DesktopDatePicker enableAccessibleFieldDOMStructure label="Desktop Date Picker" />
    </LocalizationProvider>
  );
}
