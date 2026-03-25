import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

function App() {
  const slots = {};
  return (
    <React.Fragment>
      <DatePicker />
      <DatePicker slots={slots} />
      <DateRangePicker />
    </React.Fragment>
  );
}
