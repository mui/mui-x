import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_MobileNextTimePicker as MobileNextTimePicker } from '@mui/x-date-pickers/MobileNextTimePicker';

export default function TimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer content={['MobileNextTimePicker']}>
        <MobileNextTimePicker
          label={'"hours", "minutes" and "seconds"'}
          views={['hours', 'minutes', 'seconds']}
        />
        <MobileNextTimePicker label={'"hours"'} views={['hours']} />
        <MobileNextTimePicker
          label={'"minutes" and "seconds"'}
          views={['minutes', 'seconds']}
          format="mm:ss"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
