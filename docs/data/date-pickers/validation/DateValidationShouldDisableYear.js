import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const today = dayjs();

const isInCurrentYear = (date) => date.get('year') === dayjs().get('year');

export default function DateValidationShouldDisableYear() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['NextDatePicker', 'NextDateTimePicker']}>
        <DemoItem label="DatePicker" components={['NextDatePicker']}>
          <NextDatePicker defaultValue={today} shouldDisableYear={isInCurrentYear} />
        </DemoItem>
        <DemoItem label="DateTimePicker" components={['NextDateTimePicker']}>
          <NextDateTimePicker
            defaultValue={today}
            shouldDisableYear={isInCurrentYear}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
