import * as React from 'react';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

export default function CommonlyUsedComponents() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3} sx={{ width: 400 }}>
        <NextDatePicker
          label={
            <React.Fragment>
              <code>DatePicker</code> for date editing
            </React.Fragment>
          }
        />
        <NextTimePicker
          label={
            <React.Fragment>
              <code>TimePicker</code> for time editing
            </React.Fragment>
          }
        />
        <NextDateTimePicker
          label={
            <React.Fragment>
              <code>DateTimePicker</code> for date and time editing
            </React.Fragment>
          }
        />
        <React.Fragment>
          <code>DateRangePicker</code> for date and time editing
        </React.Fragment>
        <NextDateRangePicker />
      </Stack>
    </LocalizationProvider>
  );
}
