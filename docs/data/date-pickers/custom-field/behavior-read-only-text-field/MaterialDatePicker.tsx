import * as React from 'react';
import TextField from '@mui/material/TextField';
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
import { CalendarIcon } from '@mui/x-date-pickers/icons';

function ReadOnlyDateField(props: DatePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  return (
    <TextField
      {...forwardedProps}
      value={
        pickerContext.value == null
          ? ''
          : pickerContext.value.format(pickerContext.fieldFormat)
      }
      placeholder={parsedFormat}
      InputProps={{
        ref: pickerContext.triggerRef,
        readOnly: true,
        endAdornment: <CalendarIcon color="action" />,
        sx: { cursor: 'pointer', '& *': { cursor: 'inherit' } },
      }}
      error={hasValidationError}
      focused={pickerContext.open}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      ref={pickerContext.rootRef}
      name={pickerContext.name}
      label={pickerContext.label}
    />
  );
}

function ReadOnlyFieldDatePicker(props: DatePickerProps) {
  return (
    <DatePicker {...props} slots={{ ...props.slots, field: ReadOnlyDateField }} />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReadOnlyFieldDatePicker />
    </LocalizationProvider>
  );
}
