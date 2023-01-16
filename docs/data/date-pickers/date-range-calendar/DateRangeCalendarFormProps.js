import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

export default function DateRangeCalendarFormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="disabled" content="DateRangeCalendar">
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
            disabled
          />
        </DemoItem>
        <DemoItem label="readOnly" content="DateRangeCalendar">
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
            readOnly
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
