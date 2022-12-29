import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

export default function DateTimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem
          label={'"year"", "month", "day", "hours", "minutes" and "seconds"'}
        >
          <NextDateTimePicker
            defaultValue={dayjs('2022-04-07T15:30:25')}
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
          />
        </DemoItem>
        <DemoItem label={'"day", "hours"'}>
          <NextDateTimePicker
            defaultValue={dayjs('2022-04-07T15:30:25')}
            views={['day', 'hours']}
          />
        </DemoItem>
        <DemoItem label={'"year", "day", "hours", "minutes", "seconds"'}>
          <NextDateTimePicker
            defaultValue={dayjs('2022-04-07T15:30:25')}
            views={['year', 'day', 'hours', 'minutes', 'seconds']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
