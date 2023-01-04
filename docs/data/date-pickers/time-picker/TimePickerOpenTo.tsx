import * as React from 'react';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_MobileNextTimePicker as MobileNextTimePicker } from '@mui/x-date-pickers/MobileNextTimePicker';

export default function TimePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <MobileNextTimePicker label={'"minutes"'} openTo="minutes" />
        <MobileNextTimePicker
          label={'"seconds"'}
          openTo="seconds"
          views={['hours', 'minutes', 'seconds']}
          format="LTS"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
