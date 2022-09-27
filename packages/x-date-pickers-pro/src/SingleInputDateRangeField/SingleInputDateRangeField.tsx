import * as React from 'react';
import TextField from '@mui/material/TextField';
import { SingleInputDateRangeFieldProps } from './SingleInputDateRangeField.interfaces';
import { useSingleInputDateRangeField } from './useSingleInputDateRangeField';

type DateRangeFieldComponent = (<TDate>(
  props: SingleInputDateRangeFieldProps<TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const SingleInputDateRangeField = React.forwardRef(function SingleInputDateField<TDate>(
  inProps: SingleInputDateRangeFieldProps<TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const { inputRef, inputProps } = useSingleInputDateRangeField<
    TDate,
    SingleInputDateRangeFieldProps<TDate>
  >(inProps);

  return <TextField ref={ref} inputRef={inputRef} {...inputProps} />;
}) as DateRangeFieldComponent;
