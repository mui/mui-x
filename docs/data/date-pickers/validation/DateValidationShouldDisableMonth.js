import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

const today = dayjs();

const isInCurrentMonth = (date) => date.get('month') === dayjs().get('month');

export default function DateValidationShouldDisableMonth() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DateTimePicker']}>
        <DemoItem label="DatePicker">
          <DatePicker
            defaultValue={today}
            shouldDisableMonth={isInCurrentMonth}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <DateTimePicker
            defaultValue={today}
            shouldDisableMonth={isInCurrentMonth}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
