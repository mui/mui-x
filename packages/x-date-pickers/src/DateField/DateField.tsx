import * as React from 'react';
import TextField from '@mui/material/TextField';

import { DateFieldProps } from './DateField.interfaces';
import { useDateField } from './useDateField';

type DateFieldComponent = (<TDate>(
  props: DateFieldProps<TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const DateField = React.forwardRef(function DateField<TDate>(
  inProps: DateFieldProps<TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const { inputRef, inputProps } = useDateField<TDate, DateFieldProps<TDate>>(inProps);

  return <TextField ref={ref} inputRef={inputRef} {...inputProps} />;
}) as DateFieldComponent;
