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
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';

interface JoyDateFieldProps
  extends Omit<JoyTextFieldProps, 'value' | 'defaultValue' | 'onChange' | 'onError'>,
    UseDateFieldProps<Date, Date> {}

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

interface UnstyledDateFieldProps
  extends Omit<
      InputUnstyledProps,
      'value' | 'defaultValue' | 'onChange' | 'onError'
    >,
    UseDateFieldProps<Date, Date> {}

const UnstyledDateField = (props: UnstyledDateFieldProps) => {
  const { inputRef, inputProps } = useDateField<Date, Date, UnstyledDateFieldProps>(
    props,
  );

  return (
    <InputUnstyled
      {...inputProps}
      componentsProps={{ input: { ref: inputRef, style: { width: '100%' } } }}
    />
  );
};

interface BrowserInputDateFieldProps
  extends Omit<
      React.HTMLAttributes<HTMLInputElement>,
      'value' | 'defaultValue' | 'onChange' | 'onError'
    >,
    UseDateFieldProps<Date, Date> {}

const BrowserInputDateField = (props: BrowserInputDateFieldProps) => {
  const { inputRef, inputProps } = useDateField<
    Date,
    Date,
    BrowserInputDateFieldProps
  >(props);

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
