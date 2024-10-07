import * as React from 'react';

import Button from '@mui/material/Button';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useValidation } from '@mui/x-date-pickers/validation';
import { validateDateRange } from '@mui/x-date-pickers-pro/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickersContext,
} from '@mui/x-date-pickers/hooks';

function ButtonDateRangeField(props) {
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
    validator: validateDateRange,
    value,
    timezone,
    props: internalProps,
  });

  const handleTogglePicker = (event) => {
    if (pickersContext.open) {
      pickersContext.onClose(event);
    } else {
      pickersContext.onOpen(event);
    }
  };

  const valueStr = (value ?? [null, null])
    .map((date) => (date == null ? parsedFormat : date.format(format)))
    .join(' – ');

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

export function ButtonFieldDateRangePicker(props) {
  return (
    <DateRangePicker
      {...props}
      slots={{ ...props.slots, field: ButtonDateRangeField }}
    />
  );
}
