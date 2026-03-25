import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickerDay2 } from '@mui/x-date-pickers/PickerDay2';
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';

function App() {
  const slots = { day: PickerDay2 };
  return (
    <React.Fragment>
      <DatePicker slots={{ day: PickerDay2 }} />
      <DatePicker slots={slots} />
      <DateRangePicker slots={{ day: DateRangePickerDay2 }} />
    </React.Fragment>
  );
}
