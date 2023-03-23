import * as React from 'react';
import PropTypes from 'prop-types';

import { useSlotProps } from '@mui/base/utils';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

const BrowserInput = styled('input')({ flexGrow: 1 });

const BrowserField = React.forwardRef((props, inputRef) => {
  const {
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    ...other
  } = props;

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
      id={id}
      ref={containerRef}
    >
      {startAdornment}
      <BrowserInput disabled={disabled} ref={inputRef} {...other} />
      {endAdornment}
    </Box>
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

BrowserDateField.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object])
        .isRequired,
    }),
  ]),
  slotProps: PropTypes.object,
  slots: PropTypes.object,
};

function BrowserDatePicker(props) {
  return (
    <DatePicker slots={{ field: BrowserDateField, ...props.slots }} {...props} />
  );
}

BrowserDatePicker.propTypes = {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.any,
};

export default function PickerWithBrowserField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: 400 }}>
        <BrowserDatePicker />
        <BrowserDateRangePicker />
      </Stack>
    </LocalizationProvider>
  );
}
