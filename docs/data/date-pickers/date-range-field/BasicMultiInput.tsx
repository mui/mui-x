import * as React from 'react';
import addWeeks from 'date-fns/addWeeks';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function BasicMultiInput() {
  const [value, setValue] = React.useState<DateRange<Date>>([
    new Date(),
    addWeeks(new Date(), 1),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MultiInputDateRangeField
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </LocalizationProvider>
  );
}
