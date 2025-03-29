import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function DateTimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateTimePicker', 'DateTimePicker', 'DateTimePicker']}
      >
        <DemoItem
          label={'"year"", "month", "day", "hours", "minutes" and "seconds"'}
        >
          <DateTimePicker
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
          />
        </DemoItem>
        <DemoItem label={'"day", "hours"'}>
          <DateTimePicker views={['day', 'hours']} />
        </DemoItem>
        <DemoItem label={'"year", "day", "hours", "minutes", "seconds"'}>
          <DateTimePicker views={['year', 'day', 'hours', 'minutes', 'seconds']} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
