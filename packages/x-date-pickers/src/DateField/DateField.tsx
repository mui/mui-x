import * as React from 'react';
import TextField from '@mui/material/TextField';

import { DateFieldProps } from './DateField.interfaces';
import { useDateField } from './useDateField';

type DateFieldComponent = (<TInputDate, TDate = TInputDate>(
  props: DateFieldProps<TInputDate, TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const DateField = React.forwardRef(function DateField<TInputDate, TDate = TInputDate>(
  inProps: DateFieldProps<TInputDate, TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const { inputRef, inputProps } = useDateField<
    TInputDate,
    TDate,
    DateFieldProps<TInputDate, TDate>
  >(inProps);

  return <TextField ref={ref} inputRef={inputRef} {...inputProps} />;
}) as DateFieldComponent;
