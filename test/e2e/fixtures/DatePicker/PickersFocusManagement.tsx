import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function PickersFocusManagement() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <input aria-label="decoy" />
      <DesktopDatePicker enableAccessibleFieldDOMStructure label="Desktop Date Picker" />
      <DesktopTimePicker
        enableAccessibleFieldDOMStructure
        label="Desktop Single Time Picker"
        timeSteps={{ minutes: 30 }}
        thresholdToRenderTimeInASingleColumn={48}
      />
      <DesktopTimePicker enableAccessibleFieldDOMStructure label="Desktop Time Picker" />
      <DesktopDateRangePicker
        enableAccessibleFieldDOMStructure
        label="Desktop Date Range Picker"
        slots={{ field: SingleInputDateRangeField }}
      />
    </LocalizationProvider>
  );
}
