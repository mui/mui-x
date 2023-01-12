import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/demo/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

const lastMonday = dayjs().startOf('week');
const nextSunday = dayjs().endOf('week').startOf('day');

const isWeekend = (date: Dayjs) => {
  const day = date.day();

  return day === 0 || day === 6;
};

export default function DateValidationShouldDisableDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="DatePicker">
          <NextDatePicker
            defaultValue={nextSunday}
            shouldDisableDate={isWeekend}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <NextDateTimePicker
            defaultValue={nextSunday}
            shouldDisableDate={isWeekend}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
        <DemoItem label="DateRangePicker">
          <NextDateRangePicker
            defaultValue={[lastMonday, nextSunday]}
            shouldDisableDate={isWeekend}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
