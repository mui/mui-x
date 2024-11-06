import * as React from 'react';
import { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DateRangePicker,
  DateRangePickerProps,
  DateRangePickerFieldProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { useValidation } from '@mui/x-date-pickers/validation';
import { validateDateRange } from '@mui/x-date-pickers-pro/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';

function ButtonDateRangeField(props: DateRangePickerFieldProps) {
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
    validator: validateDateRange,
    value,
    timezone,
    props: internalProps,
  });

  const handleTogglePicker = (event: React.UIEvent) => {
    if (pickerContext.open) {
      pickerContext.onClose(event);
    } else {
      pickerContext.onOpen(event);
    }
  };

  const formattedValue = (value ?? [null, null])
    .map((date: Dayjs) => (date == null ? parsedFormat : date.format(format)))
    .join(' – ');

  return (
    <Button
      {...other}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      ref={InputProps?.ref}
      onClick={handleTogglePicker}
    >
      {label ? `${label}: ${formattedValue}` : formattedValue}
    </Button>
  );
}

// TODO v8: Will be removed before the end of the alpha since single input will become the default field.
ButtonDateRangeField.fieldType = 'single-input';

function ButtonFieldDateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePicker
      {...props}
      slots={{ ...props.slots, field: ButtonDateRangeField }}
    />
  );
}

export default function MaterialDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ButtonFieldDateRangePicker />
    </LocalizationProvider>
  );
}
