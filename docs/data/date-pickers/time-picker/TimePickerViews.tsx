import * as React from 'react';
import dayjs from 'dayjs';
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
          defaultValue={dayjs('2022-04-07T15:30:25')}
          views={['hours', 'minutes', 'seconds']}
        />
        <NextTimePicker
          label={'"hours"'}
          defaultValue={dayjs('2022-04-07T15:30:25')}
          views={['hours']}
        />
        <NextTimePicker
          label={'"minutes" and "seconds"'}
          defaultValue={dayjs('2022-04-07T15:30:25')}
          views={['minutes', 'seconds']}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
