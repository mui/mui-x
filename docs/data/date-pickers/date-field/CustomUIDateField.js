import * as React from 'react';
import PropTypes from 'prop-types';
import { CssVarsProvider } from '@mui/joy/styles';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/joy/FormLabel';
import JoyTextField from '@mui/joy/TextField';
import InputUnstyled from '@mui/base/InputUnstyled';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

const JoyDateField = (props) => {
  const { value, onChange, format, ...other } = props;

  const { inputRef, inputProps } = useDateField({ value, onChange, format });

  return (
    <JoyTextField
      {...other}
      {...inputProps}
      componentsProps={{ input: { componentsProps: { input: { ref: inputRef } } } }}
    />
  );
};

JoyDateField.propTypes = {
  /**
   * @default `adapter.formats.keyboardDate`
   */
  format: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)])
    .isRequired,
};

const UnstyledDateField = (props) => {
  const { value, onChange, format, ...other } = props;

  const { inputRef, inputProps } = useDateField({ value, onChange, format });

  return (
    <InputUnstyled
      {...other}
      {...inputProps}
      componentsProps={{ input: { ref: inputRef, style: { width: '100%' } } }}
    />
  );
};

UnstyledDateField.propTypes = {
  /**
   * @default `adapter.formats.keyboardDate`
   */
  format: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)])
    .isRequired,
};

const BrowserInputDateField = (props) => {
  const { value, onChange, format, ...other } = props;

  const { inputRef, inputProps } = useDateField({ value, onChange, format });

  return <input {...other} {...inputProps} ref={inputRef} />;
};

BrowserInputDateField.propTypes = {
  /**
   * @default `adapter.formats.keyboardDate`
   */
  format: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)])
    .isRequired,
};

export default function CustomUIDateField() {
  const [value, setValue] = React.useState(new Date());

  const handleChange = (newValue) => setValue(newValue);

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
