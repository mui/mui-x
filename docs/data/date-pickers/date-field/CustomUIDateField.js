import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputUnstyled from '@mui/base/InputUnstyled';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

const UnstyledDateField = (props) => {
  const { inputRef, inputProps } = useDateField(props);

  return (
    <InputUnstyled
      {...inputProps}
      componentsProps={{ input: { ref: inputRef, style: { width: '100%' } } }}
    />
  );
};

const BrowserInputDateField = (props) => {
  const {
    inputRef,
    inputProps: { error, ...inputProps },
  } = useDateField(props);

  return <input {...inputProps} ref={inputRef} />;
};

export default function CustomUIDateField() {
  const [value, setValue] = React.useState(dayjs('2022-04-07'));

  const handleChange = (newValue) => setValue(newValue);

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
