import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label={'"hours", "minutes" and "seconds"'}>
          <TimeClock
            defaultValue={dayjs('2022-04-07T15:30:25')}
            views={['hours', 'minutes', 'seconds']}
          />
        </DemoItem>
        <DemoItem label={'"hours"'}>
          <TimeClock defaultValue={dayjs('2022-04-07T15:30:25')} views={['hours']} />
        </DemoItem>
        <DemoItem label={'"minutes" and "seconds"'}>
          <TimeClock
            defaultValue={dayjs('2022-04-07T15:30:25')}
            views={['minutes', 'seconds']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
