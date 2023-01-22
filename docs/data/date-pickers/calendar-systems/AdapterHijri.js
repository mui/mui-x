import * as React from 'react';
import moment from 'moment';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function AdapterHijri() {
  return (
    <LocalizationProvider dateAdapter={AdapterMomentHijri}>
      <DatePicker label="Date Picker" defaultValue={moment(new Date(2022, 1, 1))} />
    </LocalizationProvider>
  );
}
