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
  const { onChange, value, format, ...other } = inProps;
  const { inputRef, inputProps } = useDateRangeField<TInputDate, TDate>({
    onChange,
    value,
    format,
  });

  return <TextField ref={ref} inputRef={inputRef} {...other} {...inputProps} />;
}) as DateRangeFieldComponent;
