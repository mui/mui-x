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

import { useClearableField } from '@mui/x-date-pickers/hooks';

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
    sx,
    ...other
  } = props;

  return (
    <Box
      sx={{ ...(sx || {}), display: 'flex', alignItems: 'center', flexGrow: 1 }}
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

  const {
    onClear,
    clearable,
    slots: inSlots,
    slotProps: inSlotProps,
    ...fieldProps
  } = useSingleInputDateRangeField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
    useClearableField({
      onClear,
      clearable,
      fieldProps,
      InputProps: {
        ...fieldProps.InputProps,
        endAdornment: (
          <IconButton onClick={onAdornmentClick}>
            <DateRangeIcon />
          </IconButton>
        ),
      },
      slots: inSlots,
      slotProps: inSlotProps,
    });

  return (
    <BrowserField
      {...processedFieldProps}
      style={{
        minWidth: 300,
      }}
      InputProps={{ ...ProcessedInputProps, ref }}
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
      {...props}
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      slots={{ field: BrowserSingleInputDateRangeField }}
      slotProps={{
        field: { onAdornmentClick: toggleOpen, ...props?.slotProps?.field },
      }}
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
  const { inputRef: externalInputRef, ...textFieldProps } = props;

  const { onClear, clearable, slots, slotProps, ...fieldProps } = useDateField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
    useClearableField({
      onClear,
      clearable,
      fieldProps,
      InputProps: fieldProps.InputProps,
      slots,
      slotProps,
    });

  return <BrowserField {...processedFieldProps} InputProps={ProcessedInputProps} />;
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
        <BrowserDatePicker
          slotProps={{
            field: { clearable: true },
          }}
        />
        <BrowserSingleInputDateRangePicker
          slotProps={{
            field: { clearable: true },
          }}
        />
        <BrowserDateRangePicker />
      </DemoContainer>
    </LocalizationProvider>
  );
}
