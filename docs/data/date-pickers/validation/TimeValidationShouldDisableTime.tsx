import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Unstable_NextTimePicker as NextTimePicker,
  NextTimePickerProps,
} from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const shouldDisableTime: NextTimePickerProps<Dayjs>['shouldDisableTime'] = (
  value,
  view,
) => view === 'minutes' && value.minute() >= 45;

const defaultValue = dayjs().set('hour', 10).set('minute', 50).startOf('minute');

export default function TimeValidationShouldDisableTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer content={["NextDateTimePicker", "NextTimePicker"]}>
        <DemoItem label="TimePicker" content={["NextTimePicker"]}>
          <NextTimePicker
            defaultValue={defaultValue}
            shouldDisableTime={shouldDisableTime}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker" content={["NextDateTimePicker"]}>
          <NextDateTimePicker
            defaultValue={defaultValue}
            shouldDisableTime={shouldDisableTime}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
