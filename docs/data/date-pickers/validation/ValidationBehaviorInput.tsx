import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const tomorrow = dayjs().add(1, 'day');

export default function ValidationBehaviorInput() {
  const [value, setValue] = React.useState<Dayjs | null>(tomorrow);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        disableFuture
        disableOpenPicker
        value={value}
        onChange={(newValue) => setValue(newValue)}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
