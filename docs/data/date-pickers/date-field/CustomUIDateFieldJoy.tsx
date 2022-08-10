import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import TextField from '@mui/joy/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  unstable_useDateField as useDateField,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';

const JoyDateField = (props: UseDateFieldProps<Date, Date>) => {
  const { inputRef, inputProps } = useDateField(props);

  return (
    <TextField
      {...inputProps}
      componentsProps={{ input: { componentsProps: { input: { ref: inputRef } } } }}
    />
  );
};

export default function CustomUIDateFieldJoy() {
  const [value, setValue] = React.useState<Date | null>(new Date());

  return (
    <CssVarsProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <JoyDateField value={value} onChange={(newValue) => setValue(newValue)} />
      </LocalizationProvider>
    </CssVarsProvider>
  );
}
