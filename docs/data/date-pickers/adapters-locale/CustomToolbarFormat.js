import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function CustomToolbarFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        defaultValue={dayjs('2022-04-17')}
        slotProps={{
          toolbar: { toolbarFormat: 'ddd DD MMMM', hidden: false },
        }}
      />
    </LocalizationProvider>
  );
}
