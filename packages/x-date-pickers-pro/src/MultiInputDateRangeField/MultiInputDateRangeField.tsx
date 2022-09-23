import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { MultiInputDateRangeFieldProps } from './MultiInputDateRangeField.interfaces';
import { useMultiInputDateRangeField } from './useMultiInputDateRangeField';

type MultiInputDateRangeFieldComponent = (<TDate>(
  props: MultiInputDateRangeFieldProps<TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const MultiInputDateRangeField = React.forwardRef(function MultiInputDateRangeField<TDate>(
  inProps: MultiInputDateRangeFieldProps<TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const { startDate, endDate } = useMultiInputDateRangeField<
    TDate,
    MultiInputDateRangeFieldProps<TDate>
  >(inProps);

  return (
    <Stack spacing={2} direction="row" alignItems="center" ref={ref}>
      <TextField inputRef={startDate.inputRef} {...startDate.inputProps} />
      <Typography>to</Typography>
      <TextField inputRef={endDate.inputRef} {...endDate.inputProps} />
    </Stack>
  );
}) as MultiInputDateRangeFieldComponent;
