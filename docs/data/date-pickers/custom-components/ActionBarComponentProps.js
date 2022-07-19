import * as React from 'react';

import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function ActionBarComponentProps() {
  const [value, setValue] = React.useState(() => new Date(2022, 1, 1, 1, 1));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        onChange={(newValue) => setValue(newValue)}
        value={value}
        renderInput={(params) => <TextField {...params} />}
        componentsProps={{
          actionBar: {
            actions: ['today'],
          },
        }}
      />
    </LocalizationProvider>
  );
}
