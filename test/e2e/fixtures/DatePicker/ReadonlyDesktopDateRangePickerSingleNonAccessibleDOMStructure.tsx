import * as React from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function ReadonlyDesktopDateRangePickerSingleNonAccessibleDOMStructure() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        slots={{ field: SingleInputDateRangeField }}
        slotProps={{ field: { readOnly: true } }}
        enableAccessibleFieldDOMStructure={false}
      />
    </LocalizationProvider>
  );
}
