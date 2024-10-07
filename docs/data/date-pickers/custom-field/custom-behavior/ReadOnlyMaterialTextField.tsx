import * as React from 'react';
import { Dayjs } from 'dayjs';
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
  usePickersContext,
} from '@mui/x-date-pickers/hooks';
import { CalendarIcon } from '@mui/x-date-pickers/icons';

function ReadOnlyDateField(props: DatePickerFieldProps<Dayjs, false>) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, format } = internalProps;
  const { InputProps, slotProps, slots, ...other } = forwardedProps;

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

  return (
    <TextField
      {...other}
      value={value == null ? '' : value.format(format)}
      placeholder={parsedFormat}
      InputProps={{
        ...InputProps,
        readOnly: true,
        endAdornment: <CalendarIcon color="action" />,
        sx: { cursor: 'pointer', '& *': { cursor: 'inherit' } },
      }}
      error={hasValidationError}
      onClick={handleTogglePicker}
    />
  );
}

function ReadOnlyFieldDatePicker(props: DatePickerProps<Dayjs>) {
  return (
    <DatePicker {...props} slots={{ ...props.slots, field: ReadOnlyDateField }} />
  );
}

export default function ReadOnlyMaterialTextField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReadOnlyFieldDatePicker />
    </LocalizationProvider>
  );
}
