import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/demo/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_MobileNextDateTimePicker as MobileNextDateTimePicker } from '@mui/x-date-pickers/MobileNextDateTimePicker';

export default function DateTimePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <MobileNextDateTimePicker label={'"year"'} openTo="year" />
        <MobileNextDateTimePicker label={'"hours"'} openTo="hours" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
