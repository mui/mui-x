import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

const today = dayjs();
const tomorrow = dayjs().add(1, 'day');

export default function DateValidationMinDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="DatePicker">
          <NextDatePicker
            defaultValue={today}
            minDate={tomorrow}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <NextDateTimePicker
            defaultValue={today}
            minDate={tomorrow}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
        <DemoItem label="DateRangePicker">
          <NextDateRangePicker defaultValue={[today, tomorrow]} minDate={tomorrow} />
        </DemoItem>
        <DemoItem label="DateRangeCalendar" collapsed>
          <DateRangeCalendar defaultValue={[today, tomorrow]} minDate={tomorrow} />
        </DemoItem>
        <DemoItem label="DateCalendar" collapsed>
          <DateCalendar defaultValue={today} minDate={tomorrow} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
