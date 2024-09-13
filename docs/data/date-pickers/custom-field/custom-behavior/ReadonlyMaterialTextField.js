import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import { useSplitFieldProps, useFieldPlaceholder } from '@mui/x-date-pickers/hooks';
import TextField from '@mui/material/TextField';

function ReadonlyDateField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, format, onOpen } = internalProps;
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
      onClick={onOpen}
    />
  );
}

function ReadonlyFieldDatePicker(props) {
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
