import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/joy/FormLabel';
import JoyTextField, {
  TextFieldProps as JoyTextFieldProps,
} from '@mui/joy/TextField';
import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
} from '@mui/x-date-pickers/DateField';

type JoyDateFieldProps = UseDateFieldComponentProps<Date, Date, JoyTextFieldProps>;

const JoyDateField = (props: JoyDateFieldProps) => {
  const { inputRef, inputProps } = useDateField<Date, Date, JoyDateFieldProps>(
    props,
  );

  return (
    <JoyTextField
      {...inputProps}
      componentsProps={{ input: { componentsProps: { input: { ref: inputRef } } } }}
    />
  );
};

type UnstyledDateFieldProps = UseDateFieldComponentProps<
  Date,
  Date,
  InputUnstyledProps
>;

const UnstyledDateField = (props: UnstyledDateFieldProps) => {
  const { inputRef, inputProps } = useDateField<Date, Date, UnstyledDateFieldProps>(
    props,
  );

  return (
    <InputUnstyled
      {...(inputProps as InputUnstyledProps)}
      componentsProps={{ input: { ref: inputRef, style: { width: '100%' } } }}
    />
  );
};

type BrowserInputDateFieldProps = UseDateFieldComponentProps<
  Date,
  Date,
  React.HTMLAttributes<HTMLInputElement>
>;

const BrowserInputDateField = (props: BrowserInputDateFieldProps) => {
  const {
    inputRef,
    inputProps: { error, ...inputProps },
  } = useDateField<Date, Date, BrowserInputDateFieldProps>(props);

  return <input {...inputProps} ref={inputRef} />;
};

export default function CustomUIDateField() {
  const [value, setValue] = React.useState<Date | null>(new Date());

  const handleChange = (newValue: Date | null) => setValue(newValue);

  return (
    <CssVarsProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={2}>
          <JoyDateField
            label="Using @mui/joy TextField"
            value={value}
            onChange={handleChange}
          />
          <FormControlLabel
            label={<FormLabel>Using unstyled input</FormLabel>}
            control={<UnstyledDateField value={value} onChange={handleChange} />}
            labelPlacement="top"
            sx={{ alignItems: 'stretch' }}
          />
          <FormControlLabel
            label={<FormLabel>Using browser input</FormLabel>}
            control={<BrowserInputDateField value={value} onChange={handleChange} />}
            labelPlacement="top"
            sx={{ alignItems: 'stretch' }}
          />
        </Stack>
      </LocalizationProvider>
    </CssVarsProvider>
  );
}
