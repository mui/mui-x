import * as React from 'react';

import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useSlotProps } from '@mui/base/utils';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

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
    ...other
  } = props;

  const handleRef = useForkRef(containerRef, ref);

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
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

  const { inputRef: externalInputRef, ...textFieldProps } = useSlotProps({
    elementType: null,
    externalSlotProps: slotProps?.textField,
    externalForwardedProps: other,
    ownerState: props,
  });

  const { ref: inputRef, ...response } = useSingleInputDateRangeField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return (
    <BrowserField
      {...response}
      ref={ref}
      style={{
        minWidth: 300,
      }}
      inputRef={inputRef}
      InputProps={{
        ...response.InputProps,
        endAdornment: (
          <IconButton onClick={onAdornmentClick}>
            <DateRangeIcon />
          </IconButton>
        ),
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
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      slots={{ field: BrowserSingleInputDateRangeField }}
      slotProps={{
        field: { onAdornmentClick: toggleOpen },
      }}
      {...props}
    />
  );
});

const BrowserMultiInputDateRangeField = React.forwardRef((props, ref) => {
  const {
    slotProps,
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    disabled,
    onError,
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    selectedSections,
    onSelectedSectionsChange,
    className,
  } = props;

  const { inputRef: startInputRef, ...startTextFieldProps } = useSlotProps({
    elementType: null,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...props, position: 'start' },
  });

  const { inputRef: endInputRef, ...endTextFieldProps } = useSlotProps({
    elementType: null,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...props, position: 'end' },
  });

  const {
    startDate: { ref: startRef, ...startDateProps },
    endDate: { ref: endRef, ...endDateProps },
  } = useMultiInputDateRangeField({
    sharedProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      disabled,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      selectedSections,
      onSelectedSectionsChange,
    },
    startTextFieldProps,
    endTextFieldProps,
    startInputRef,
    endInputRef,
  });

  return (
    <Stack ref={ref} spacing={2} direction="row" className={className}>
      <BrowserField {...startDateProps} inputRef={startRef} />
      <span> — </span>
      <BrowserField {...endDateProps} inputRef={endRef} />
    </Stack>
  );
});

const BrowserDateRangePicker = React.forwardRef((props, ref) => {
  return (
    <DateRangePicker
      ref={ref}
      slots={{ field: BrowserMultiInputDateRangeField }}
      {...props}
    />
  );
});

const BrowserDateField = React.forwardRef((props, ref) => {
  const { inputRef: externalInputRef, slots, slotProps, ...textFieldProps } = props;

  const { ref: inputRef, ...other } = useDateField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return <BrowserField ref={ref} inputRef={inputRef} {...other} />;
});

const BrowserDatePicker = React.forwardRef((props, ref) => {
  return (
    <DatePicker
      ref={ref}
      slots={{ field: BrowserDateField, ...props.slots }}
      {...props}
    />
  );
});

export default function PickerWithBrowserField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DatePicker', 'SingleInputDateRangeField', 'DateRangePicker']}
      >
        <BrowserDatePicker />
        <BrowserSingleInputDateRangePicker />
        <BrowserDateRangePicker />
      </DemoContainer>
    </LocalizationProvider>
  );
}
