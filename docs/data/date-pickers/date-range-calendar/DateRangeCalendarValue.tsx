import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DateRange } from '@mui/x-date-pickers-pro';

export default function DateRangeCalendarValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([
    dayjs('2022-04-07'),
    dayjs('2022-04-10'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="Uncontrolled calendar">
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Controlled calendar">
          <DateRangeCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
