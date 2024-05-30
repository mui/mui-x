import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

const todayAtNoon = dayjs().set('hour', 12).startOf('hour');
const todayAt9AM = dayjs().set('hour', 9).startOf('hour');

export default function DateTimeValidationMaxDateTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimeRangePicker']}>
        <DemoItem label="DateTimePicker">
          <DateTimePicker defaultValue={todayAtNoon} maxDateTime={todayAt9AM} />
        </DemoItem>
        <DemoItem label="DateTimeRangePicker" component="DateTimeRangePicker">
          <DateTimeRangePicker
            defaultValue={[todayAt9AM, todayAtNoon]}
            maxDateTime={todayAt9AM}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
