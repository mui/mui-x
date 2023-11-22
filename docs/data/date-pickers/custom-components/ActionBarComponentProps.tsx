import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function ActionBarComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        defaultValue={dayjs('2022-04-17')}
        slotProps={{
          actionBar: {
            actions: ['today'],
          },
        }}
      />
    </LocalizationProvider>
  );
}
