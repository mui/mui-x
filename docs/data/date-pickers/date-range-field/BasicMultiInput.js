import * as React from 'react';
import addWeeks from 'date-fns/addWeeks';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

export default function BasicMultiInput() {
  const [value, setValue] = React.useState([new Date(), addWeeks(new Date(), 1)]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MultiInputDateRangeField
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </LocalizationProvider>
  );
}
