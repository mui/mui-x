import * as React from 'react';
import TextField from '@mui/material/TextField';

import { DateFieldProps } from './DateField.interfaces';
import { useDateField } from './useDateField';

export const DateField = React.forwardRef(function DateField<TInputDate, TDate = TInputDate>(
  inProps: DateFieldProps<TInputDate, TDate>,
) {
  const { onChange, value, format, ...other } = inProps;
  const { inputRef, inputProps } = useDateField<TInputDate, TDate>({ onChange, value, format });

  return <TextField inputRef={inputRef} {...other} {...inputProps} />;
});
