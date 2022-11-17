import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

const BrowserInput = (props) => {
  const { inputProps, InputProps, ownerState, ...other } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <input {...inputProps} {...other} />
      {InputProps?.endAdornment}
    </Box>
  );
};

BrowserInput.propTypes = {
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps: PropTypes.object,
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/material-ui/api/filled-input/),
   * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps: PropTypes.object,
  ownerState: PropTypes.any,
};

export default function CustomInput() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextDatePicker
        label="Custom input"
        defaultValue={dayjs('2022-04-07')}
        components={{
          Input: BrowserInput,
        }}
      />
    </LocalizationProvider>
  );
}
