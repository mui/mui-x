import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

export default function TimePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MobileTimePicker', 'MobileTimePicker']}>
        <MobileTimePicker label={'"minutes"'} openTo="minutes" />
        <MobileTimePicker
          label={'"seconds"'}
          openTo="seconds"
          views={['minutes', 'seconds']}
          format="mm:ss"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
