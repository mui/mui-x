import * as React from 'react';
import dayjs from 'dayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function MobileDatePickerV6WithClearAction() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        label="Mobile Date Picker"
        defaultValue={dayjs('2022-04-17')}
        slotProps={{
          actionBar: {
            actions: ['clear', 'cancel', 'accept'],
          },
        }}
      />
    </LocalizationProvider>
  );
}
