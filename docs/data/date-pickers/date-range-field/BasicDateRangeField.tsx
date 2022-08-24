import * as React from 'react';
import addWeeks from 'date-fns/addWeeks';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_DateRangeField as DateRangeField } from '@mui/x-date-pickers-pro/DateRangeField';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function BasicDateRangeField() {
  const [value, setValue] = React.useState<DateRange<Date>>([
    new Date(),
    addWeeks(new Date(), 1),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangeField value={value} onChange={(newValue) => setValue(newValue)} />
    </LocalizationProvider>
  );
}
