import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickerDay2 } from '@mui/x-date-pickers/PickerDay2';
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';

function App() {
  const slots = { day: PickerDay2 };
  // slots still needed: used on a non-picker component
  const slotsWithNonPicker = { day: PickerDay2 };
  // slots still needed: has other properties
  const slotsWithOtherProps = { day: PickerDay2, toolbar: () => null };
  return (
    <React.Fragment>
      <DatePicker slots={{ day: PickerDay2 }} />
      <DatePicker slots={slots} />
      <DateRangePicker slots={{ day: DateRangePickerDay2 }} />
      <UnknownComponent slots={slotsWithNonPicker} />
      <DatePicker slots={slotsWithOtherProps} />
    </React.Fragment>
  );
}
