import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickersDay2 } from '@mui/x-date-pickers/PickersDay2';
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';

function App() {
  return (
    <React.Fragment>
      <DatePicker slots={{ day: PickersDay2 }} />
      <DateRangePicker slots={{ day: DateRangePickerDay2 }} />
    </React.Fragment>
  );
}
