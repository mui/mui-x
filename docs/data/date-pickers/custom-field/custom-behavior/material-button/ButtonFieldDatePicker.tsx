import * as React from 'react';
import { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickersContext,
} from '@mui/x-date-pickers/hooks';

function ButtonDateField(props: DatePickerFieldProps<Dayjs, false>) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, format } = internalProps;

  const {
    InputProps,
    slotProps,
    slots,
    focused,
    name,
    label,
    ownerState,
    ...other
  } = forwardedProps;

  const pickersContext = usePickersContext();

  const parsedFormat = useParsedFormat(internalProps);
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  const handleTogglePicker = (event: React.UIEvent) => {
    if (pickersContext.open) {
      pickersContext.onClose(event);
    } else {
      pickersContext.onOpen(event);
    }
  };

  const valueStr = value == null ? parsedFormat : value.format(format);

  return (
    <Button
      {...other}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      ref={InputProps?.ref}
      onClick={handleTogglePicker}
    >
      {label ? `${label}: ${valueStr}` : valueStr}
    </Button>
  );
}

export function ButtonFieldDatePicker(props: DatePickerProps<Dayjs>) {
  return (
    <DatePicker {...props} slots={{ ...props.slots, field: ButtonDateField }} />
  );
}
