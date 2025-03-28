import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function DateRangePickerCalendarProp() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateRangePicker', 'DateRangePicker', 'DateRangePicker']}
      >
        <DemoItem label="1 calendar" component="DateRangePicker">
          <DateRangePicker calendars={1} />
        </DemoItem>
        <DemoItem label="2 calendars" component="DateRangePicker">
          <DateRangePicker calendars={2} />
        </DemoItem>
        <DemoItem label="3 calendars" component="DateRangePicker">
          <DateRangePicker calendars={3} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
