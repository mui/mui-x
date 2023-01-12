import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/demo/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const todayAtNoon = dayjs().set('hour', 12).startOf('hour');
const todayAt3PM = dayjs().set('hour', 15).startOf('hour');

export default function DateTimeValidationMinDateTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="DateTimePicker">
          <NextDateTimePicker defaultValue={todayAtNoon} minDateTime={todayAt3PM} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
