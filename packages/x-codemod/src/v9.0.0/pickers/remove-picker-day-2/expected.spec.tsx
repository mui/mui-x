import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

function App() {
  // slots still needed: used on a non-picker component
  const slotsWithNonPicker = {};
  // slots still needed: has other properties
  const slotsWithOtherProps = {
    toolbar: () => null,
  };
  return (
    <React.Fragment>
      <DatePicker />
      <DatePicker />
      <DateRangePicker />
      <UnknownComponent slots={slotsWithNonPicker} />
      <DatePicker slots={slotsWithOtherProps} />
    </React.Fragment>
  );
}
