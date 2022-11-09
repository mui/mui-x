import * as React from 'react';
import moment from 'moment';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function AdapterHijri() {
  return (
    <LocalizationProvider dateAdapter={AdapterMomentHijri}>
      <NextDatePicker
        label="Date Picker"
        defaultValue={moment(new Date(2022, 1, 1))}
      />
    </LocalizationProvider>
  );
}
