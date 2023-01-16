import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

export default function DateTimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem
          label={'"year"", "month", "day", "hours", "minutes" and "seconds"'}
          content="NextDateTimePicker"
        >
          <NextDateTimePicker
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
          />
        </DemoItem>
        <DemoItem label={'"day", "hours"'} content="NextDateTimePicker">
          <NextDateTimePicker views={['day', 'hours']} />
        </DemoItem>
        <DemoItem
          label={'"year", "day", "hours", "minutes", "seconds"'}
          content="NextDateTimePicker"
        >
          <NextDateTimePicker
            views={['year', 'day', 'hours', 'minutes', 'seconds']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
