import * as React from 'react';

import { unstable_useForkRef as useForkRef } from '@mui/utils';
import useSlotProps from '@mui/utils/useSlotProps';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
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

const BrowserSingleInputDateRangeField = React.forwardRef((props, ref) => {
  const { slots, slotProps, onAdornmentClick, ...other } = props;

  const textFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    externalForwardedProps: other,
    ownerState: props,
  });

  textFieldProps.InputProps = {
    ...textFieldProps.InputProps,
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={onAdornmentClick}>
          <DateRangeIcon />
        </IconButton>
      </InputAdornment>
    ),
  };

  const fieldResponse = useSingleInputDateRangeField({
    ...textFieldProps,
    enableAccessibleFieldDOMStructure: false,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const processedFieldProps = useClearableField({
    ...fieldResponse,
    slots,
    slotProps,
  });

  return (
    <BrowserField
      {...processedFieldProps}
      ref={ref}
      style={{
        minWidth: 300,
      }}
    />
  );
});

BrowserSingleInputDateRangeField.fieldType = 'single-input';

const BrowserSingleInputDateRangePicker = React.forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen((currentOpen) => !currentOpen);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  return (
    <DateRangePicker
      ref={ref}
      {...props}
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      slots={{ ...props.slots, field: BrowserSingleInputDateRangeField }}
      slotProps={{
        ...props.slotProps,
        field: {
          onAdornmentClick: toggleOpen,
          ...props.slotProps?.field,
        },
      }}
    />
  );
});

export default function BrowserV6SingleInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserSingleInputDateRangePicker
        slotProps={{
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  );
}
