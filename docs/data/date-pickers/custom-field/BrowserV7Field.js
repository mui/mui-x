import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { styled } from '@mui/material/styles';
import { CalendarIcon, ClearIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';
import { usePickerContext } from '@mui/x-date-pickers/hooks';

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

const BrowserIconButton = styled('button', {
  name: 'BrowserField',
  slot: 'IconButton',
})({
  backgroundColor: 'transparent',
  border: 0,
  cursor: 'pointer',
  '&:hover, &:focus': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

function BrowserDateField(props) {
  const fieldResponse = useDateField(props);

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
    onClear,
    clearable,
    // Can be used to style the component
    areAllSectionsEmpty,
    disabled,
    readOnly,
    focused,
    error,
    // The rest can be passed to the root element
    ...other
  } = fieldResponse;

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);

  return (
    <BrowserFieldRoot {...other} ref={handleRef}>
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
      {clearable && value && (
        <BrowserIconButton
          type="button"
          title="Clear"
          tabIndex={-1}
          onClick={onClear}
          sx={{ marginLeft: 1 }}
        >
          <ClearIcon fontSize="small" />
        </BrowserIconButton>
      )}
      <BrowserIconButton
        onClick={() => pickerContext.setOpen((prev) => !prev)}
        sx={{ marginLeft: 1 }}
        aria-label={openPickerAriaLabel}
      >
        <CalendarIcon />
      </BrowserIconButton>
    </BrowserFieldRoot>
  );
}

function BrowserDatePicker(props) {
  return (
    <DatePicker {...props} slots={{ field: BrowserDateField, ...props.slots }} />
  );
}

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
