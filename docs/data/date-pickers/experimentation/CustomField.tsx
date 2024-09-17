import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { DateFieldInPickerProps } from '@mui/x-date-pickers/DateField';

function ReadOnlyField(props: DateFieldInPickerProps<Dayjs, false>) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const { value, timezone, format } = internalProps;
  const { InputProps, slotProps, slots, ...other } = forwardedProps;

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
      InputProps={{ ...InputProps, readOnly: true }}
      error={hasValidationError}
    />
  );
}

export default function CustomField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label="Date Picker"
          slots={{ field: ReadOnlyField }}
          maxDate={dayjs('2022-04-17')}
          defaultValue={dayjs('2022-04-18')}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
