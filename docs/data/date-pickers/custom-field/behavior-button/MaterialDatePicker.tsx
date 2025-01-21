import * as React from 'react';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';

function ButtonDateField(props: DatePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { ownerState, focused, ...other } = forwardedProps;

  const pickerContext = usePickerContext();
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...other}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      ref={pickerContext.triggerRef}
      className={pickerContext.fieldClassName}
      sx={pickerContext.fieldSx}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.fieldLabel
        ? `${pickerContext.fieldLabel}: ${valueStr}`
        : valueStr}
    </Button>
  );
}

function ButtonFieldDatePicker(props: DatePickerProps) {
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
