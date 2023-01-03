import * as React from 'react';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';

export default function TimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextTimePicker
          label={'"hours", "minutes" and "seconds"'}
          views={['hours', 'minutes', 'seconds']}
        />
        <NextTimePicker label={'"hours"'} views={['hours']} />
        <NextTimePicker
          label={'"minutes" and "seconds"'}
          views={['minutes', 'seconds']}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
