import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const adapter = new AdapterDateFns();
export default function CustomizeDayPicker() {
  const [value, setValue] = React.useState(adapter.date());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
        dayOfWeekFormatter={(day) => `${day}.`}
        toolbarFormat="eee dd MMMM"
        showToolbar
      />
    </LocalizationProvider>
  );
}
