import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjsInstance from 'dayjs';
// plugins mandatory for the AdapterDayjS
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
// plugins to get week number
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';

dayjsInstance.extend(customParseFormatPlugin);
dayjsInstance.extend(localizedFormatPlugin);
dayjsInstance.extend(isBetweenPlugin);
dayjsInstance.extend(weekOfYearPlugin);

export default function AddWeekNumber() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} instance={dayjsInstance}>
      <StaticDatePicker
        displayWeekNumber
        getWeekNumber={(date) => `${date.week()}`}
        label="Basic example"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
