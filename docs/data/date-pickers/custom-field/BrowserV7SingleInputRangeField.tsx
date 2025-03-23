import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { styled } from '@mui/material/styles';
import { ClearIcon, DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
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

interface BrowserSingleInputDateRangeFieldProps extends DateRangePickerFieldProps {}

function BrowserSingleInputDateRangeField(
  props: BrowserSingleInputDateRangeFieldProps,
) {
  const fieldResponse = useSingleInputDateRangeField<true, typeof props>(props);

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
    <BrowserFieldRoot
      {...other}
      ref={handleRef}
      style={{
        minWidth: 300,
      }}
    >
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
        aria-label={openPickerAriaLabel}
        sx={{ marginLeft: 1 }}
      >
        <DateRangeIcon />
      </BrowserIconButton>
    </BrowserFieldRoot>
  );
}

BrowserSingleInputDateRangeField.fieldType = 'single-input';

function BrowserSingleInputDateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePicker
      {...props}
      slots={{ ...props.slots, field: BrowserSingleInputDateRangeField }}
    />
  );
}

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
