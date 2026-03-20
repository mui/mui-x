import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

function App() {
  return (
    <React.Fragment>
      <DatePicker />
      <DateRangePicker />
      <DatePicker
        slots={{
          calendarHeader: () => null,
        }}
      />
      <DatePicker slots={{ day: MyCustomDay }} />
    </React.Fragment>
  );
}
