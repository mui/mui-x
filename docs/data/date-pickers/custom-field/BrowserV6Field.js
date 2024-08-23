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
    // Should be ignored
    enableAccessibleFieldDOMStructure,
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
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
        },
        sx || {},
      ]}
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
  const { slots, slotProps, ...textFieldProps } = props;

  const fieldResponse = useDateField({
    ...textFieldProps,
    enableAccessibleFieldDOMStructure: false,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const processedFieldProps = useClearableField({
    ...fieldResponse,
    slots,
    slotProps,
  });

  return <BrowserField ref={ref} {...processedFieldProps} />;
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

export default function BrowserV6Field() {
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
