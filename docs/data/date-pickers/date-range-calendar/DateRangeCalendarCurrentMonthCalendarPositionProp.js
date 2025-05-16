import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DemoContainer } from '../_shared/DemoContainer';

export default function DateRangeCalendarCurrentMonthCalendarPositionProp() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar']}>
        <DateRangeCalendar currentMonthCalendarPosition={2} disableFuture />
      </DemoContainer>
    </LocalizationProvider>
  );
}
