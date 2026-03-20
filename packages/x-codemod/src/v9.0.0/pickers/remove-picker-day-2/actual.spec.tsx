import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickerDay2 } from '@mui/x-date-pickers/PickerDay2';
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';

function App() {
  return (
    <React.Fragment>
      <DatePicker slots={{ day: PickerDay2 }} />
      <DateRangePicker slots={{ day: DateRangePickerDay2 }} />
      <DatePicker
        slots={{
          day: PickerDay2,
          calendarHeader: () => null,
        }}
      />
      <DatePicker slots={{ day: MyCustomDay }} />
    </React.Fragment>
  );
}
