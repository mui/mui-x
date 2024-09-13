import * as React from 'react';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DateFieldInPickerProps } from '@mui/x-date-pickers/DateField';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import { useSplitFieldProps, useFieldPlaceholder } from '@mui/x-date-pickers/hooks';
import TextField from '@mui/material/TextField';

function ReadonlyField(props: DateFieldInPickerProps<Dayjs, false>) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, format } = internalProps;
  const { InputProps, slotProps, slots, ...other } = forwardedProps;

  const placeholder = useFieldPlaceholder(internalProps);
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  return (
    <TextField
      {...other}
      value={value == null ? '' : value.format(format)}
      placeholder={placeholder}
      InputProps={{ ...InputProps, readOnly: true }}
      error={hasValidationError}
    />
  );
}

function ReadonlyFieldDatePicker(props: DatePickerProps<Dayjs>) {
  return <DatePicker slots={{ ...props.slots, field: ReadonlyField }} {...props} />;
}

export default function CustomReadonlyBehaviorMaterialTextField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReadonlyFieldDatePicker />
    </LocalizationProvider>
  );
}
