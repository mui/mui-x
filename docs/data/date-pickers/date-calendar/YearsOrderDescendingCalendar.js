import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';

const currentYear = dayjs();

export default function YearsOrderDescendingCalendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['YearCalendar']}>
        <DemoItem label="Years in descending order">
          <YearCalendar maxDate={currentYear} yearsOrder="desc" />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
