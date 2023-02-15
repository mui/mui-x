import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const today = dayjs();

const isInCurrentYear = (date) => date.get('year') === dayjs().get('year');

export default function DateValidationShouldDisableYear() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DateTimePicker']}>
        <DemoItem label="DatePicker">
          <DatePicker defaultValue={today} shouldDisableYear={isInCurrentYear} />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <DateTimePicker defaultValue={today} shouldDisableYear={isInCurrentYear} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
