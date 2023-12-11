import * as React from 'react';

import { unstable_useForkRef as useForkRef } from '@mui/utils';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
import { useClearableField } from '@mui/x-date-pickers/hooks';

const BrowserField = React.forwardRef((props, ref) => {
  const {
    disabled,
    id,
    label,
    inputRef,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
    error,
    focused,
    ownerState,
    sx,
    ...other
  } = props;

  const handleRef = useForkRef(containerRef, ref);

  return (
    <Box
      sx={{ ...(sx || {}), display: 'flex', alignItems: 'center' }}
      id={id}
      ref={handleRef}
    >
      {startAdornment}
      <input disabled={disabled} ref={inputRef} {...other} />
      {endAdornment}
    </Box>
  );
});

const BrowserDateField = React.forwardRef((props, ref) => {
  const { inputRef: externalInputRef, slots, slotProps, ...textFieldProps } = props;

  const fieldResponse = useDateField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const processedFieldProps = useClearableField({
    props: fieldResponse,
    slots,
    slotProps,
  });

  const { ref: inputRef, ...otherProcessedFieldProps } = processedFieldProps;

  return (
    <BrowserField ref={ref} inputRef={inputRef} {...otherProcessedFieldProps} />
  );
});

const BrowserDatePicker = React.forwardRef((props, ref) => {
  return (
    <DatePicker
      ref={ref}
      {...props}
      slots={{ ...props.slots, field: BrowserDateField }}
    />
  );
});

export default function PickerWithBrowserField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDatePicker
        slotProps={{
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  );
}
