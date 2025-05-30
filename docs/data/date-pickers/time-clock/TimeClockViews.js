import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function TimeClockViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock', 'TimeClock']}>
        <DemoItem label={'"hours", "minutes" and "seconds"'}>
          <TimeClock views={['hours', 'minutes', 'seconds']} />
        </DemoItem>
        <DemoItem label={'"hours"'}>
          <TimeClock views={['hours']} />
        </DemoItem>
        <DemoItem label={'"minutes" and "seconds"'}>
          <TimeClock views={['minutes', 'seconds']} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
