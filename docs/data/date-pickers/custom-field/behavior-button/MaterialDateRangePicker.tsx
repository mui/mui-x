import * as React from 'react';
import { Dayjs } from 'dayjs';
import useForkRef from '@mui/utils/useForkRef';
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

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDateRange,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  const formattedValue = pickerContext.value
    .map((date: Dayjs) =>
      date == null ? parsedFormat : date.format(pickerContext.fieldFormat),
    )
    .join(' – ');

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      ref={handleRef}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label
        ? `${pickerContext.label}: ${formattedValue}`
        : formattedValue}
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
