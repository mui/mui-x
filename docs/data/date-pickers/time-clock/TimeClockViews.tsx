import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock', 'TimeClock']}>
        <DemoItem label={'"hours", "minutes" and "seconds"'} component="TimeClock">
          <TimeClock views={['hours', 'minutes', 'seconds']} />
        </DemoItem>
        <DemoItem label={'"hours"'} component="TimeClock">
          <TimeClock views={['hours']} />
        </DemoItem>
        <DemoItem label={'"minutes" and "seconds"'} component="TimeClock">
          <TimeClock views={['minutes', 'seconds']} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
