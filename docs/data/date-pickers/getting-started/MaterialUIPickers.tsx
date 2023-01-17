import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_DesktopNextDatePicker as DesktopNextDatePicker } from '@mui/x-date-pickers/DesktopNextDatePicker';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';

export default function MaterialUIPickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        content={[
          "DesktopNextDatePicker",
          "MobileNextDatePicker",
          "NextDateTimePicker",
          "NextTimePicker"
        ]}>
        <DesktopNextDatePicker label="Date desktop" format="MM/DD/YYYY" />
        <MobileNextDatePicker label="Date mobile" format="MM/DD/YYYY" />
        <NextTimePicker label="Time" />
        <NextDateTimePicker label="Date&Time picker" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
