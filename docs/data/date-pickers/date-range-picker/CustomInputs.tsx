import * as React from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import { TextFieldProps } from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

type BrowserInputProps = TextFieldProps & {
  ownerState?: any;
};

function BrowserInput(props: BrowserInputProps) {
  const { inputProps, InputProps, ownerState, ...other } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <input {...inputProps} {...(other as any)} />
      {InputProps?.endAdornment}
    </Box>
  );
}

export default function CustomInputs() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextDateRangePicker
        defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
        components={{
          Input: BrowserInput,
        }}
      />
    </LocalizationProvider>
  );
}
