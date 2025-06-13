import * as React from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function ReadonlyDesktopDateRangePickerSingleNonAccessibleDOMStructure() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        slotProps={{ field: { readOnly: true } }}
        enableAccessibleFieldDOMStructure={false}
      />
    </LocalizationProvider>
  );
}
