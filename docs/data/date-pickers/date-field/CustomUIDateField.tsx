import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
} from '@mui/x-date-pickers/DateField';

type UnstyledDateFieldProps = UseDateFieldComponentProps<
  Dayjs,
  Dayjs,
  InputUnstyledProps
>;

const UnstyledDateField = (props: UnstyledDateFieldProps) => {
  const { inputRef, inputProps } = useDateField<
    Dayjs,
    Dayjs,
    UnstyledDateFieldProps
  >(props);

  return (
    <InputUnstyled
      {...(inputProps as InputUnstyledProps)}
      componentsProps={{ input: { ref: inputRef, style: { width: '100%' } } }}
    />
  );
};

type BrowserInputDateFieldProps = UseDateFieldComponentProps<
  Dayjs,
  Dayjs,
  React.HTMLAttributes<HTMLInputElement>
>;

const BrowserInputDateField = (props: BrowserInputDateFieldProps) => {
  const {
    inputRef,
    inputProps: { error, ...inputProps },
  } = useDateField<Dayjs, Dayjs, BrowserInputDateFieldProps>(props);

  return <input {...inputProps} ref={inputRef} />;
};

export default function CustomUIDateField() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

  const handleChange = (newValue: Dayjs | null) => setValue(newValue);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <FormControlLabel
          label={<FormLabel>Using unstyled input</FormLabel>}
          control={<UnstyledDateField value={value} onChange={handleChange} />}
          labelPlacement="top"
          sx={{ margin: 0 }}
        />
        <FormControlLabel
          label={<FormLabel>Using browser input</FormLabel>}
          control={<BrowserInputDateField value={value} onChange={handleChange} />}
          labelPlacement="top"
          sx={{ margin: 0 }}
        />
      </Stack>
    </LocalizationProvider>
  );
}
