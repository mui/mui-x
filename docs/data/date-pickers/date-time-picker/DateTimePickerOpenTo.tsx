import * as React from 'react';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

export default function DateTimePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDateTimePicker label={'"year"'} openTo="year" />
        <NextDateTimePicker
            label={'"hours"'}
            openTo="hours"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
