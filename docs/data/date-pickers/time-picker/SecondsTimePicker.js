import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';

export default function SecondsTimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer content={['NextTimePicker']}>
        <NextTimePicker
          label="Hours, minutes and seconds"
          views={['hours', 'minutes', 'seconds']}
          format="HH:mm:ss"
          defaultValue={dayjs('2022-04-07T15:30:10')}
        />
        <NextTimePicker
          label="Minutes and seconds"
          views={['minutes', 'seconds']}
          openTo="minutes"
          format="mm:ss"
          defaultValue={dayjs('2022-04-07T15:30:10')}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
