import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';

const BrowserFieldRoot = styled('div', { name: 'BrowserField', slot: 'Root' })({
  display: 'flex',
  alignItems: 'center',
  '& .MuiInputAdornment-root': {
    height: 'auto',
  },
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
    // Should be passed to the button that opens the picker
    openPickerAriaLabel,
    // Can be passed to a hidden <input /> element
    onChange,
    value,
    // Can be passed to the button that clears the value
    clearable,
    onClear,
    // Can be used to render a custom label
    label,
    // Can be used to style the component
    areAllSectionsEmpty,
    disabled,
    readOnly,
    focused,
    error,
    // The rest can be passed to the root element
    ...other
  } = props;

  const pickerContext = usePickerContext();
  const handleTogglePicker = (event) => {
    if (pickerContext.open) {
      pickerContext.onClose(event);
    } else {
      pickerContext.onOpen(event);
    }
  };

  const handleRef = useForkRef(pickerContext.triggerRef, ref);

  return (
    <BrowserFieldRoot ref={handleRef} {...other}>
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
      <IconButton
        onClick={handleTogglePicker}
        sx={{ marginLeft: 1.5 }}
        aria-label={openPickerAriaLabel}
      >
        <DateRangeIcon />
      </IconButton>
    </BrowserFieldRoot>
  );
});

const BrowserSingleInputDateRangeField = React.forwardRef((props, ref) => {
  const { slots, slotProps, ...other } = props;

  const textFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    externalForwardedProps: other,
    ownerState: props,
  });

  const fieldResponse = useSingleInputDateRangeField(textFieldProps);

  return (
    <BrowserTextField
      {...fieldResponse}
      ref={ref}
      style={{
        minWidth: 300,
      }}
    />
  );
});

BrowserSingleInputDateRangeField.fieldType = 'single-input';

const BrowserSingleInputDateRangePicker = React.forwardRef((props, ref) => {
  return (
    <DateRangePicker
      ref={ref}
      {...props}
      slots={{ ...props.slots, field: BrowserSingleInputDateRangeField }}
    />
  );
});

export default function BrowserV7SingleInputRangeField() {
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
