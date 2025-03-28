import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function YearMonthCalendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['YearCalendar', 'MonthCalendar']}>
        <DemoItem label="YearCalendar">
          <YearCalendar />
        </DemoItem>
        <DemoItem label="MonthCalendar">
          <MonthCalendar />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
