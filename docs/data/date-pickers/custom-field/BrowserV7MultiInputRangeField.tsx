import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
import { unstable_useMultiInputRangeField as useMultiInputRangeField } from '@mui/x-date-pickers-pro/hooks';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';
import {
  MultiInputFieldSlotTextFieldProps,
  MultiInputFieldRefs,
  BaseMultiInputPickersTextFieldProps,
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
  extends BaseMultiInputPickersTextFieldProps<true>,
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      keyof BaseMultiInputPickersTextFieldProps<true>
    > {}

const BrowserTextField = React.forwardRef(
  (props: BrowserTextFieldProps, ref: React.Ref<unknown>) => {
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
  },
);

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

type BrowserMultiInputDateRangeFieldComponent = ((
  props: BrowserMultiInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const BrowserMultiInputDateRangeField = React.forwardRef(
  (props: BrowserMultiInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const manager = useDateRangeManager();
    const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
    const { slotProps, ownerState, ...otherForwardedProps } = forwardedProps;

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
      startForwardedProps: startTextFieldProps,
      endForwardedProps: endTextFieldProps,
    });

    return (
      <Stack
        ref={ref}
        spacing={2}
        direction="row"
        overflow="auto"
        {...otherForwardedProps}
      >
        <BrowserTextField {...(fieldResponse.startDate as BrowserTextFieldProps)} />
        <span>–</span>
        <BrowserTextField {...(fieldResponse.endDate as BrowserTextFieldProps)} />
      </Stack>
    );
  },
) as BrowserMultiInputDateRangeFieldComponent;

const BrowserDateRangePicker = React.forwardRef(
  (props: DateRangePickerProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <DateRangePicker
        ref={ref}
        {...props}
        slots={{ ...props.slots, field: BrowserMultiInputDateRangeField }}
      />
    );
  },
);

export default function BrowserV7MultiInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDateRangePicker />
    </LocalizationProvider>
  );
}
