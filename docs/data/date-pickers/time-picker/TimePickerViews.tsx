import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function TimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker', 'TimePicker', 'TimePicker']}>
        <DemoItem label={'"hours", "minutes" and "seconds"'}>
          <TimePicker views={['hours', 'minutes', 'seconds']} />
        </DemoItem>
        <DemoItem label={'"hours"'}>
          <TimePicker views={['hours']} />
        </DemoItem>
        <DemoItem label={'"minutes" and "seconds"'}>
          <TimePicker views={['minutes', 'seconds']} format="mm:ss" />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
