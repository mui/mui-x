import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

const lastSunday = dayjs().startOf('week').subtract(1, 'day');
const nextSunday = dayjs().endOf('week').startOf('day');

const isWeekend = (date) => {
  const day = date.day();

  return day === 0 || day === 6;
};

export default function DateRangeValidationShouldDisableDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker', 'DateTimeRangePicker']}>
        <DemoItem label="DateRangePicker" component="DateRangePicker">
          <DateRangePicker
            defaultValue={[lastSunday, nextSunday]}
            shouldDisableDate={(date, position) => {
              if (position === 'end') {
                return false;
              }

              return isWeekend(date);
            }}
          />
        </DemoItem>
        <DemoItem label="DateTimeRangePicker" component="DateTimeRangePicker">
          <DateTimeRangePicker
            defaultValue={[lastSunday, nextSunday]}
            shouldDisableDate={(date, position) => {
              if (position === 'end') {
                return false;
              }

              return isWeekend(date);
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
