import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import { DateField } from '@mui/x-date-pickers/DateField';

function ReadOnlyDateField(props) {
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
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    />
  );
}

function ReadOnlyOnMobileDateField(props) {
  const pickerContext = usePickerContext();

  if (pickerContext.variant === 'mobile') {
    return <ReadOnlyDateField {...props} />;
  }

  return <DateField {...props} />;
}

function ReadOnlyFieldDatePicker(props) {
  return (
    <DatePicker
      {...props}
      slots={{ ...props.slots, field: ReadOnlyOnMobileDateField }}
    />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReadOnlyFieldDatePicker />
    </LocalizationProvider>
  );
}
