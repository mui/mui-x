import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

export default function DateTimeRangePickerCalendarProp() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimeRangePicker',
          'DateTimeRangePicker',
          'DateTimeRangePicker',
        ]}
      >
        <DemoItem label="1 calendar" component="DateTimeRangePicker">
          <DateTimeRangePicker calendars={1} />
        </DemoItem>
        <DemoItem label="2 calendars" component="DateTimeRangePicker">
          <DateTimeRangePicker calendars={2} />
        </DemoItem>
        <DemoItem label="3 calendars" component="DateTimeRangePicker">
          <DateTimeRangePicker calendars={3} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
