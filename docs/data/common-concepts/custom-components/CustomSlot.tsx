import * as React from 'react';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomSlot() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker slots={{ openPickerIcon: FlightTakeoffIcon }} />
    </LocalizationProvider>
  );
}
