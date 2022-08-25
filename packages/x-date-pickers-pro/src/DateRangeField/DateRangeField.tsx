import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateRangeFieldProps } from './DateRangeField.interfaces';
import { useDateRangeField } from './useDateRangeField';

type DateRangeFieldComponent = (<TInputDate, TDate = TInputDate>(
  props: DateRangeFieldProps<TInputDate, TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const DateRangeField = React.forwardRef(function DateField<TInputDate, TDate = TInputDate>(
  inProps: DateRangeFieldProps<TInputDate, TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const { inputRef, inputProps } = useDateRangeField<
    TInputDate,
    TDate,
    DateRangeFieldProps<TInputDate, TDate>
  >(inProps);

  return <TextField ref={ref} inputRef={inputRef} {...inputProps} />;
}) as DateRangeFieldComponent;
