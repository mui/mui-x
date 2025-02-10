import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
import { unstable_useMultiInputRangeField as useMultiInputRangeField } from '@mui/x-date-pickers-pro/hooks';
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

function BrowserTextField(props) {
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
    // Can be used to style the component
    areAllSectionsEmpty,
    disabled,
    readOnly,
    focused,
    error,
    InputProps: { ref, startAdornment, endAdornment } = {},
    // The rest can be passed to the root element
    ...other
  } = props;

  return (
    <BrowserFieldRoot {...other} ref={ref}>
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
}

function BrowserMultiInputDateRangeField(props) {
  const pickerContext = usePickerContext();
  const manager = useDateRangeManager();
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { slotProps, ...otherForwardedProps } = forwardedProps;

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

  const fieldResponse = useMultiInputRangeField({
    manager,
    internalProps,
    startForwardedProps: startTextFieldProps,
    endForwardedProps: endTextFieldProps,
  });

  return (
    <Stack
      ref={pickerContext.rootRef}
      spacing={2}
      direction="row"
      overflow="auto"
      {...otherForwardedProps}
    >
      <BrowserTextField {...fieldResponse.startDate} />
      <span>–</span>
      <BrowserTextField {...fieldResponse.endDate} />
    </Stack>
  );
}

function BrowserDateRangePicker(props) {
  return (
    <DateRangePicker
      {...props}
      slots={{ ...props.slots, field: BrowserMultiInputDateRangeField }}
    />
  );
}

export default function BrowserV7MultiInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDateRangePicker />
    </LocalizationProvider>
  );
}
