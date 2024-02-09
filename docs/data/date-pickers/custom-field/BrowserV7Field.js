import * as React from 'react';

import useForkRef from '@mui/utils/useForkRef';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
import { useClearableField } from '@mui/x-date-pickers/hooks';

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

const BrowserDateField = React.forwardRef((props, ref) => {
  const { slots, slotProps, ...textFieldProps } = props;

  const fieldResponse = useDateField({
    ...textFieldProps,
    enableAccessibleFieldDOMStructure: true,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const processedFieldProps = useClearableField({
    ...fieldResponse,
    slots,
    slotProps,
  });

  return <BrowserTextField ref={ref} {...processedFieldProps} />;
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
