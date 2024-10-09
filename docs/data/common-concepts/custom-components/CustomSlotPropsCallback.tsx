import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomSlotPropsCallback() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        slotProps={{
          openPickerIcon: (ownerState) => ({
            color: ownerState.open ? 'secondary' : 'primary',
          }),
        }}
      />
    </LocalizationProvider>
  );
}
