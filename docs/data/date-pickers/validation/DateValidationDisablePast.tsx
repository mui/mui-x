import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');
const todayStartOfTheDay = today.startOf('day');

export default function DateValidationDisablePast() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          "NextDatePicker",
          "NextDateTimePicker",
          "NextTimePicker",
          "NextDateRangePicker"
        ]}>
        <DemoItem label="DatePicker" components={["NextDatePicker"]}>
          <NextDatePicker
            defaultValue={yesterday}
            disablePast
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="TimePicker" components={["NextTimePicker"]}>
          <NextTimePicker defaultValue={todayStartOfTheDay} disablePast />
        </DemoItem>
        <DemoItem label="DateTimePicker" components={["NextDateTimePicker"]}>
          <NextDateTimePicker
            defaultValue={yesterday}
            disablePast
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
        <DemoItem label="DateRangePicker" components={["NextDateRangePicker"]}>
          <NextDateRangePicker defaultValue={[yesterday, today]} disablePast />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
