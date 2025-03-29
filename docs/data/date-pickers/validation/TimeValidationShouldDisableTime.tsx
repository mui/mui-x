import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

const shouldDisableTime: TimePickerProps['shouldDisableTime'] = (value, view) =>
  view === 'minutes' && value.minute() >= 45;

const defaultValue = dayjs().set('hour', 10).set('minute', 50).startOf('minute');

export default function TimeValidationShouldDisableTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'TimePicker',
          'DateTimePicker',
          'TimeRangePicker',
          'DateTimeRangePicker',
        ]}
      >
        <DemoItem label="TimePicker">
          <TimePicker
            defaultValue={defaultValue}
            shouldDisableTime={shouldDisableTime}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <DateTimePicker
            defaultValue={defaultValue}
            shouldDisableTime={shouldDisableTime}
          />
        </DemoItem>
        <DemoItem label="TimeRangePicker" component="TimeRangePicker">
          <TimeRangePicker
            defaultValue={[defaultValue, defaultValue.add(30, 'minutes')]}
            shouldDisableTime={shouldDisableTime}
          />
        </DemoItem>
        <DemoItem label="DateTimeRangePicker" component="DateTimeRangePicker">
          <DateTimeRangePicker
            defaultValue={[defaultValue, defaultValue.add(30, 'minutes')]}
            shouldDisableTime={shouldDisableTime}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
