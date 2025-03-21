import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
import {
  unstable_useMultiInputRangeField as useMultiInputRangeField,
  UseMultiInputRangeFieldTextFieldProps,
} from '@mui/x-date-pickers-pro/hooks';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';
import {
  MultiInputFieldSlotTextFieldProps,
  MultiInputFieldRefs,
} from '@mui/x-date-pickers-pro/models';

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

interface BrowserTextFieldProps
  extends UseMultiInputRangeFieldTextFieldProps<
    true,
    React.HTMLAttributes<HTMLDivElement>
  > {
  triggerRef?: React.Ref<HTMLDivElement>;
}

function BrowserTextField(props: BrowserTextFieldProps) {
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

    triggerRef,

    // The rest can be passed to the root element
    ...other
  } = props;

  return (
    <BrowserFieldRoot {...other} ref={triggerRef}>
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
    </BrowserFieldRoot>
  );
}

interface BrowserMultiInputDateRangeFieldProps
  extends Omit<
      DateRangePickerFieldProps,
      'unstableFieldRef' | 'clearable' | 'onClear'
    >,
    MultiInputFieldRefs {
  slotProps: {
    textField: any;
  };
}

function BrowserMultiInputDateRangeField(
  props: BrowserMultiInputDateRangeFieldProps,
) {
  const manager = useDateRangeManager();
  const pickerContext = usePickerContext();
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { slotProps, ...otherForwardedProps } = forwardedProps;

  const startTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { position: 'start' } as any,
  }) as MultiInputFieldSlotTextFieldProps;

  const endTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { position: 'end' } as any,
  }) as MultiInputFieldSlotTextFieldProps;

  const fieldResponse = useMultiInputRangeField({
    manager,
    internalProps,
    startTextFieldProps,
    endTextFieldProps,
    rootProps: {
      ref: pickerContext.rootRef,
      spacing: 2,
      direction: 'row' as const,
      overflow: 'auto',
      ...otherForwardedProps,
    },
  });

  return (
    <Stack {...fieldResponse.root}>
      <BrowserTextField
        {...fieldResponse.startTextField}
        triggerRef={pickerContext.triggerRef}
      />
      <span>–</span>
      <BrowserTextField {...fieldResponse.endTextField} />
    </Stack>
  );
}

BrowserMultiInputDateRangeField.fieldType = 'multi-input';

function BrowserDateRangePicker(props: DateRangePickerProps) {
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
