import * as React from 'react';
import TextField from '@mui/material/TextField';
import { SingleInputDateRangeFieldProps } from './SingleInputDateRangeField.interfaces';
import { useSingleInputDateRangeField } from './useSingleInputDateRangeField';

type DateRangeFieldComponent = (<TInputDate, TDate = TInputDate>(
  props: SingleInputDateRangeFieldProps<TInputDate, TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const SingleInputDateRangeField = React.forwardRef(function SingleInputDateField<
  TInputDate,
  TDate = TInputDate,
>(inProps: SingleInputDateRangeFieldProps<TInputDate, TDate>, ref: React.Ref<HTMLInputElement>) {
  const { inputRef, inputProps } = useSingleInputDateRangeField<
    TInputDate,
    TDate,
    SingleInputDateRangeFieldProps<TInputDate, TDate>
  >(inProps);

  return <TextField ref={ref} inputRef={inputRef} {...inputProps} />;
}) as DateRangeFieldComponent;
