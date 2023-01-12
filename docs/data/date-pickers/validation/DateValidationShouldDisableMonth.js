import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/demo/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const today = dayjs();

const isInCurrentMonth = (date) => date.get('month') === dayjs().get('month');

export default function DateValidationShouldDisableMonth() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="DatePicker">
          <NextDatePicker
            defaultValue={today}
            shouldDisableMonth={isInCurrentMonth}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <NextDateTimePicker
            defaultValue={today}
            shouldDisableMonth={isInCurrentMonth}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
