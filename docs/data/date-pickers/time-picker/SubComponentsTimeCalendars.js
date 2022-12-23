import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function SubComponentsTimeCalendars() {
  const [value, setValue] = React.useState();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimeClock value={value} onChange={(newValue) => setValue(newValue)} />
    </LocalizationProvider>
  );
}
