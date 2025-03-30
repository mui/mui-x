import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

const today = dayjs();
const tomorrow = dayjs().add(1, 'day');
const todayEndOfTheDay = today.endOf('day');

export default function DateValidationDisableFuture() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DatePicker',
          'TimePicker',
          'DateTimePicker',
          'DateRangePicker',
          'TimeRangePicker',
          'DateTimeRangePicker',
        ]}
      >
        <DemoItem label="DatePicker">
          <DatePicker
            defaultValue={tomorrow}
            disableFuture
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="TimePicker">
          <TimePicker defaultValue={todayEndOfTheDay} disableFuture />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <DateTimePicker
            defaultValue={tomorrow}
            disableFuture
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
        <DemoItem label="DateRangePicker" component="DateRangePicker">
          <DateRangePicker defaultValue={[today, tomorrow]} disableFuture />
        </DemoItem>
        <DemoItem label="TimeRangePicker" component="TimeRangePicker">
          <TimeRangePicker defaultValue={[today, tomorrow]} disableFuture />
        </DemoItem>
        <DemoItem label="DateTimeRangePicker" component="DateTimeRangePicker">
          <DateTimeRangePicker defaultValue={[today, tomorrow]} disableFuture />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
