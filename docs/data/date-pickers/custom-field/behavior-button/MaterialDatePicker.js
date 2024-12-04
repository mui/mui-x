import * as React from 'react';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';

function ButtonDateField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, format } = internalProps;
  const {
    InputProps,
    slotProps,
    slots,
    ownerState,
    label,
    focused,
    name,
    ...other
  } = forwardedProps;

  const pickerContext = usePickerContext();

  const parsedFormat = useParsedFormat(internalProps);
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  const valueStr = value == null ? parsedFormat : value.format(format);

  return (
    <Button
      {...other}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      ref={InputProps?.ref}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {label ? `${label}: ${valueStr}` : valueStr}
    </Button>
  );
}

function ButtonFieldDatePicker(props) {
  return (
    <DatePicker {...props} slots={{ ...props.slots, field: ButtonDateField }} />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ButtonFieldDatePicker />
    </LocalizationProvider>
  );
}
