import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';

const BrowserFieldRoot = styled('div', { name: 'BrowserField', slot: 'Root' })({
  display: 'flex',
  alignItems: 'center',
});

const BrowserFieldContent = styled('div', { name: 'BrowserField', slot: 'Content' })(
  {
    border: '1px solid grey',
    fontSize: 13.33333,
    lineHeight: 'normal',
    padding: '1px 2px',
    whiteSpace: 'nowrap',
  },
);

const BrowserTextField = React.forwardRef((props, ref) => {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,
    // Should be passed to the PickersSectionList component
    elements,
    sectionListRef,
    contentEditable,
    onFocus,
    onBlur,
    tabIndex,
    onInput,
    onPaste,
    onKeyDown,
    // Can be passed to a hidden <input /> element
    onChange,
    value,
    // Can be used to render a custom label
    label,
    // Can be used to style the component
    areAllSectionsEmpty,
    disabled,
    readOnly,
    focused,
    error,
    InputProps: { ref: InputPropsRef, startAdornment, endAdornment } = {},
    // The rest can be passed to the root element
    ...other
  } = props;

  const handleRef = useForkRef(InputPropsRef, ref);

  return (
    <BrowserFieldRoot ref={handleRef} {...other}>
      {startAdornment}
      <BrowserFieldContent>
        <PickersSectionList
          elements={elements}
          sectionListRef={sectionListRef}
          contentEditable={contentEditable}
          onFocus={onFocus}
          onBlur={onBlur}
          tabIndex={tabIndex}
          onInput={onInput}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
        />
      </BrowserFieldContent>
      {endAdornment}
    </BrowserFieldRoot>
  );
});

const BrowserMultiInputDateRangeField = React.forwardRef((props, ref) => {
  const {
    slotProps,
    readOnly,
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    className,
    unstableStartFieldRef,
    unstableEndFieldRef,
  } = props;

  const startTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { position: 'start' },
  });

  const endTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { position: 'end' },
  });

  const fieldResponse = useMultiInputDateRangeField({
    sharedProps: {
      readOnly,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      enableAccessibleFieldDOMStructure: true,
    },
    startTextFieldProps,
    endTextFieldProps,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const {
    // The multi input range field do not support clearable and onClear
    onClear: onClearStartDate,
    clearable: isStartDateClearable,
    openPickerAriaLabel: openPickerStartDateAriaLabel,
    ...startDateProps
  } = fieldResponse.startDate;
  const {
    // The multi input range field do not support clearable and onClear
    onClear: onClearEndDate,
    clearable: isEndDateClearable,
    openPickerAriaLabel: openPickerEndDateAriaLabel,
    ...endDateProps
  } = fieldResponse.endDate;

  return (
    <Stack
      ref={ref}
      spacing={2}
      direction="row"
      overflow="auto"
      className={className}
    >
      <BrowserTextField {...startDateProps} />
      <span> – </span>
      <BrowserTextField {...endDateProps} />
    </Stack>
  );
});

const BrowserDateRangePicker = React.forwardRef((props, ref) => {
  return (
    <DateRangePicker
      ref={ref}
      {...props}
      slots={{ ...props.slots, field: BrowserMultiInputDateRangeField }}
    />
  );
});

export default function BrowserV7MultiInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDateRangePicker />
    </LocalizationProvider>
  );
}
