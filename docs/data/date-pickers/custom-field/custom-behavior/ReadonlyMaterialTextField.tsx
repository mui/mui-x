import * as React from 'react';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DateFieldInPickerProps } from '@mui/x-date-pickers/DateField';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useFieldPlaceholder,
  usePickersFieldContext,
} from '@mui/x-date-pickers/hooks';

function ReadonlyDateField(props: DateFieldInPickerProps<Dayjs, false>) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, format } = internalProps;
  const { InputProps, slotProps, slots, ...other } = forwardedProps;

  const pickerContext = usePickersFieldContext();

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
      onClick={pickerContext.onOpen}
    />
  );
}

function ReadonlyFieldDatePicker(props: DatePickerProps<Dayjs>) {
  return (
    <DatePicker slots={{ ...props.slots, field: ReadonlyDateField }} {...props} />
  );
}

export default function ReadonlyMaterialTextField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReadonlyFieldDatePicker />
    </LocalizationProvider>
  );
}
