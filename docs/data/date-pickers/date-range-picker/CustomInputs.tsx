import * as React from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import { TextFieldProps } from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

type BrowserInputProps = TextFieldProps & {
  ownerState?: any;
};

function BrowserInput(props: BrowserInputProps) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <input ref={inputRef} {...inputProps} {...(other as any)} />
      {InputProps?.endAdornment}
    </Box>
  );
}

export default function CustomInputs() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
        components={{
          TextField: BrowserInput,
        }}
      />
    </LocalizationProvider>
  );
}
