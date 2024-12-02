import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
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
    // Can be passed to an icon to clear the value
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
        <CalendarIcon />
      </IconButton>
    </BrowserFieldRoot>
  );
});

const BrowserDateField = React.forwardRef((props, ref) => {
  const { slots, slotProps, ...textFieldProps } = props;

  const fieldResponse = useDateField(textFieldProps);

  return <BrowserTextField ref={ref} {...fieldResponse} />;
});

const BrowserDatePicker = React.forwardRef((props, ref) => {
  return (
    <DatePicker
      ref={ref}
      {...props}
      slots={{ field: BrowserDateField, ...props.slots }}
    />
  );
});

export default function BrowserV7Field() {
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
