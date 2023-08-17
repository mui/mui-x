import * as React from 'react';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DesktopDateTimePickerNoTimeRenderers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDateTimePicker
        label="Desktop Date Time Picker"
        viewRenderers={{
          hours: null,
          minutes: null,
          seconds: null,
        }}
      />
    </LocalizationProvider>
  );
}
