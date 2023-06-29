import * as React from 'react';

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

const BrowserField = React.forwardRef((props, inputRef) => {
  const {
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
    error,
    focused,
    ownerState,
    ...other
  } = props;

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
      id={id}
      ref={containerRef}
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

  const response = useSingleInputDateRangeField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return (
    <BrowserField
      {...response}
      style={{
        minWidth: 300,
      }}
      InputProps={{
        ...response.InputProps,
        ref,
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

function BrowserSingleInputDateRangePicker(props) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen((currentOpen) => !currentOpen);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  return (
    <DateRangePicker
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
}

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

  const { startDate, endDate } = useMultiInputDateRangeField({
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
      <BrowserField {...startDate} />
      <span> — </span>
      <BrowserField {...endDate} />
    </Stack>
  );
});

function BrowserDateRangePicker(props) {
  return (
    <DateRangePicker slots={{ field: BrowserMultiInputDateRangeField }} {...props} />
  );
}

function BrowserDateField(props) {
  const { inputRef: externalInputRef, slots, slotProps, ...textFieldProps } = props;

  const response = useDateField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return <BrowserField {...response} />;
}

function BrowserDatePicker(props) {
  return (
    <DatePicker slots={{ field: BrowserDateField, ...props.slots }} {...props} />
  );
}

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
